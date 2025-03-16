const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator");

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
    const classificationSelect = await utilities.buildClassificationList()


    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        managementView,
        errors: null,
        classificationSelect,
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

/**
 * Render Add Inventory View
 */
invCont.buildAddInventoryView = async function (req, res) {
    let nav = await utilities.getNav();
    let classifications = await invModel.getClassifications();
    let addInventoryForm = utilities.buildAddInventoryForm(classifications.rows); // Genera el formulario completo

    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        addInventoryForm, // Ahora pasamos el formulario completo
        messages: req.flash("info"),
        errors: null,
    });
};


/**
 * Handle adding a new inventory item
 */
invCont.addInventory = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("info", { type: "error", text: "Please fix the errors and try again." });
        return res.redirect("/inv/add-inventory");
    }

    const vehicleData = req.body;
    
    try {
        const result = await invModel.insertInventory(vehicleData);
        if (result) {
            req.flash("info", { type: "success", text: "Vehicle added successfully!" });
            return res.redirect("/inv");

        } else {
            req.flash("info", { type: "error", text: "Failed to add vehicle." });
            return res.redirect("/inv/add-inventory");
        }
    } catch (error) {
        console.error("Error adding vehicle:", error);
        req.flash("info", { type: "error", text: "Database error." });
        return res.redirect("/inv/add-inventory");
    }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }

module.exports = invCont