const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const schema = new Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Product", schema)