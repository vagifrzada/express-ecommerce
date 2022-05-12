const Product = require("../models/product")
const User = require("../models/user")

const { Cart, CartItem } = require("../models/cart")

const { Order, OrderItem } = require("../models/order")

module.exports = async () => {
    Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" })
    User.hasMany(Product)

    User.hasOne(Cart)
    Cart.belongsTo(User)

    Cart.belongsToMany(Product, { through: CartItem })
    Product.belongsToMany(Cart, { through: CartItem })

    Order.belongsTo(User)
    User.hasMany(Order)
    Order.belongsToMany(Product, { through: OrderItem })
}
