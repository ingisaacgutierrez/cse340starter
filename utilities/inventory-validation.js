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

validate.validateInventory = [
    body("inv_make").notEmpty().withMessage("Make is required."),
    body("inv_model").notEmpty().withMessage("Model is required."),
    body("inv_year").isLength({ min: 4, max: 4 }).withMessage("Year must be 4 digits."),
    body("inv_description").notEmpty().withMessage("Description is required."),
    body("inv_price").isNumeric().withMessage("Price must be a number."),
    body("inv_miles").isNumeric().withMessage("Miles must be a number."),
    body("inv_color").notEmpty().withMessage("Color is required."),
    body("classification_id").isInt().withMessage("Classification is required."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("info", { type: "error", text: errors.array().map(err => err.msg).join(", ") });
            return res.redirect("/inv/add-inventory");
        }
        next();
    }
];

module.exports = validate;
