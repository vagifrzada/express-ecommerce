require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const bodyParser = require("body-parser")
const session = require("express-session")
const mongoose = require("mongoose")
const csrf = require("csurf")
const flash = require("connect-flash")
const fileUpload = require("express-fileupload")
const moment = require("moment")
const helmet = require("helmet")
const path = require("path")
const fs = require("fs")

const PORT = process.env.PORT || 3000
const errorController = require("./controllers/error")

// Auth middleware - Checking authenticated user.
const auth = require("./middlewares/auth")

// Session configuration
const MongoDBStore = require("connect-mongodb-session")(session)
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoDBStore({
            uri: process.env.DB_URL,
            collection: process.env.SESSION_COLLECTION || "sessions",
        }),
    })
)

// Create a log stream
if (process.env.LOG_TO_FILE === "true") {
    const logFileName = `log-${moment().format("YYYY-MM-DD")}.txt`
    const logStream = fs.createWriteStream(
        path.join(__dirname, "storage", "logs", logFileName),
        { flags: "a" }
    )
    app.use(
        morgan(process.env.LOG_FORMAT, {
            stream: logStream,
        })
    )
}

// Logging to console
app.use(morgan(process.env.LOG_FORMAT))

// Enable multipart-formdata
app.use(
    fileUpload({
        limits: {
            fileSize: 1024 * 1024, // 1 MB
        },
        abortOnLimit: true,
        createParentPath: true,
    })
)

app.use(helmet()) // Adds headers to response for security wise

// Setting view engine
app.set("view engine", "ejs")
// app.set("views", "views")

// Parsing body as urlencoded (form data)
app.use(bodyParser.urlencoded({ extended: false }))
// Registering middleware for serving static files e.g assets
app.use(express.static(path.join(__dirname, "public")))

// Enable CSRF protection
app.use(csrf())

// Enable session flash
app.use(flash())

// Custom middlewares
app.use(require("./middlewares/assign-user"))
app.use(require("./middlewares/local-vars"))

// Registering routes
app.use(require("./routes/web"))
app.use("/admin", auth, require("./routes/admin"))
app.use("/auth", require("./routes/auth"))

// Registering error handler
app.use(errorController.getNotFoundPage)
app.use((err, req, res, next) => {
    return res.status(500).render("errors/500", {
        title: "Server error",
        message: err.message,
    })
})
;(async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () =>
            console.log(`Waiting for requests or port ${PORT}...`)
        )
    } catch (err) {
        console.log(err)
    }
})()
