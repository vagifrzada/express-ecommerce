async function calculateTotalPrice(cart) {
    const totalPrice = cart.items.reduce((sum, item) => {
        return sum + item.quantity * item.product.price
    }, 0)

    return parseFloat(totalPrice.toFixed(2))
}

module.exports = {
    calculateTotalPrice,
}
