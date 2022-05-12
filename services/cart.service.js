function calculateTotalPrice(product) {
    return parseFloat(product.price) * +product.quantity
}

function calculateTotalPriceOfProducts(products) {
    const totalPrice = products.reduce((prev, curr) => {
        return prev + calculateTotalPrice(curr);
    }, 0);

    return parseFloat(totalPrice.toFixed(2));
}

module.exports = {
    calculateTotalPrice,
    calculateTotalPriceOfProducts
}