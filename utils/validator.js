const { validationResult } = require("express-validator")

const validate = (validations) => {
    return async (req, res, next) => {
        for (const validation of validations) {
            const result = await validation.run(req)
            if (result.errors.length) {
                break
            }
        }
        // Storing old input
        req.flash("oldUserInput", req.body)
        // Paralel processing
        // await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // return res.status(422).json({errors: errors.array()})
            req.flash("validation-errors", errors.array())
            return req.session.save(() => res.redirect("back"))
        }

        return next()
    }
}

module.exports = {
    validate,
}
