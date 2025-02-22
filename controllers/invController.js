const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        errors: null,
    })
}

/* ***************************
 *  Build Management View
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let managementView = await utilities.buildManagementView()

    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        managementView,
        errors: null,
    })
}

/* ***************************
 *  Render Add Classification View
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav();
    let addClassificationForm = utilities.buildAddClassificationForm();

    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        addClassificationForm,
        messages: req.flash("info"),
        errors: null,
    });
};

/* ***************************
 *  Add a New Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body;

    try {
        const result = await invModel.insertClassification(classification_name);

        if (result.rowCount > 0) {
            req.flash("info", { type: "success", text: "Classification added successfully!" });

            // Regenerate navigation with the new classification
            utilities.getNav();
            
            res.redirect("/inv");
        } else {
            req.flash("info", { type: "error", text: "Failed to add classification." });
            res.redirect("/inv/add-classification");
        }
    } catch (error) {
        console.error("Error adding classification:", error);
        req.flash("info", { type: "error", text: "Database error." });
        res.redirect("/inv/add-classification");
    }
};

module.exports = invCont