const deleteProductButtons = document.getElementsByClassName("delete-product")

const deleteProduct = async function () {
    if (!confirm("Are sure to delete this product ?")) {
        return false
    }

    const parentNode = this.parentNode
    const csrfToken = parentNode.querySelector("[name=_csrf]").value
    const productId = parentNode.querySelector("[name=productId]").value

    const deleteProductUrl = `/admin/products/${productId}`
    const response = await fetch(deleteProductUrl, {
        method: "DELETE",
        headers: {
            "csrf-token": csrfToken,
        },
    })
    if (response.status === 200) {
        this.closest("article").remove()
    }
}

if (deleteProductButtons.length > 0) {
    for (let button of deleteProductButtons) {
        button.onclick = deleteProduct
    }
}
