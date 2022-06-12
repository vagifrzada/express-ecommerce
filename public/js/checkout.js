const checkoutBtn = document.getElementById("checkout-btn")

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
        const parentNode = checkoutBtn.parentNode
        const csrfToken = parentNode.querySelector("[name=_csrf]").value
        const request = await fetch("/checkout/generate-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "csrf-token": csrfToken,
            },
        })

        const response = await request.json()
        if (response.status === 200) {
            window.open(response.url, "_blank")
        }
    })
}
