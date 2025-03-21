const { body, validationResult } = require("express-validator");
const validate = {};

/* *******************************
 *  Classification Data Validation Rules
 * ******************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a valid classification name.")
    ];
};

/* *******************************
 * Check classification data and return errors or continue
 * ******************************* */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        });
        return;
    }
    next();
};

/* *******************************
 *  Inventory Data Validation Rules
 * ******************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a vehicle make."),
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a vehicle model."),
        body("inv_year")
            .trim()
            .isNumeric()
            .isLength({ min: 4, max: 4 })
            .withMessage("Please provide a valid year."),
        body("inv_price")
            .trim()
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price."),
        body("inv_miles")
            .trim()
            .isInt({ min: 0 })
            .withMessage("Please provide a valid mileage."),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a color."),
    ];
};

/* *******************************
 * Check inventory data and return errors or continue
 * ******************************* */
validate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            vehicle: req.body,
        });
        return;
    }
    next();
};

/* *******************************
 * Check update inventory data and return errors or continue
 * ******************************* */
validate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req);
    const { inv_id } = req.body;  
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/edit-inventory", { 
            errors,
            title: "Edit Vehicle",  
            nav,
            vehicle: req.body,
            inv_id,
        });
        return;
    }
    next();
};

module.exports = validate;



