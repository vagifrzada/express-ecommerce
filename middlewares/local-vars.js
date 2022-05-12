module.exports = (req, res, next) => {
    res.locals.path = req.url
    res.locals.csrfToken = req.csrfToken()
    res.locals.isLoggedIn = req.session.isLoggedIn
    res.locals.user = req.user
    res.locals.flash = getFlashMessages(req)

    const oldInput = req.flash("oldUserInput")
    res.locals.old = (field) =>
        oldInput.length === 0 ? null : oldInput[0][field]

    const validationErrors = req.flash("validation-errors")
    res.locals.validation = {
        failed: validationErrors.length > 0,
        errors: () => validationErrors.map((item) => item.msg),
    }

    next()
}

function getFlashMessages(req) {
    const errorMessages = req.flash("error")
    const successMessages = req.flash("success")

    return {
        error: errorMessages.length > 0 ? errorMessages[0] : null,
        success: successMessages.length > 0 ? successMessages[0] : null,
    }
}
