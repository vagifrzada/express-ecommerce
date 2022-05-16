exports.getNotFoundPage = (req, res) => {
    return res.status(404).render("errors/404", {
        title: "Page not found",
    })
}
