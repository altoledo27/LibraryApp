const { validationResult } = require('express-validator');

// Add the validators for each schema
// const someRecordValidationRules = () => {
//     return [
//         body('firstName')
//             .notEmpty()
//             .withMessage('It should be not Empty')
//             .trim()
//             .escape()
//             .isString()]
// }

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    validate
}