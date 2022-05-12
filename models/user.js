const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,
    cart: {
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
});

userSchema.methods.clearCart = async function () {
    this.cart = { items: [] };
    return await this.save();
}

module.exports = mongoose.model("User", userSchema);