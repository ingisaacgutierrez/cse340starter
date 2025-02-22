const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
  *  Classification Validation Rules
  * ********************************* */
validate.validateClassification = [
    body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Classification name must not contain spaces or special characters."),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("info", { type: "error", text: errors.array().map(err => err.msg).join(", ") });
            return res.redirect("/inv/add-classification");
        }
        next();
    }
];

module.exports = validate;
