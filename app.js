require("dotenv").config()
const path = require("path")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session")
const mongoose = require("mongoose")
const csrf = require("csurf")
const flash = require("connect-flash")

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

// Setting view engine
app.set("view engine", "ejs")
// app.set("views", "views")

// Parsing body as json
app.use(bodyParser.urlencoded({ extended: true }))
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
