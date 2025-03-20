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

/* ***************************
 *  Render Add Inventory View
 * ************************** */
invCont.buildAddInventoryView = async function (req, res) {
    let nav = await utilities.getNav();
    let classifications = await invModel.getClassifications();
    let addInventoryForm = utilities.buildAddInventoryForm(classifications.rows);

    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        addInventoryForm,
        messages: req.flash("info"),
        errors: null,
    });
};

/* ***************************
 *  Handle adding a new inventory item
 * ************************** */
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
    const inventory_id = parseInt(req.params.inventory_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inventory_id);
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description, 
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    });
};

/* ***************************
 *  Handle updating an inventory item
 * ************************** */
invCont.updateInventory = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("info", { type: "error", text: "Please fix the errors and try again." });
        return res.redirect(`/inv/edit/${req.body.inv_id}`);
    }

    const vehicleData = req.body;

    try {
        const result = await invModel.updateInventory(vehicleData);
        if (result.rowCount > 0) {
            req.flash("info", { type: "success", text: "Vehicle updated successfully!" });
            return res.redirect("/inv");
        } else {
            req.flash("info", { type: "error", text: "Failed to update vehicle." });
            return res.redirect(`/inv/edit/${vehicleData.inv_id}`);
        }
    } catch (error) {
        console.error("Error updating vehicle:", error);
        req.flash("info", { type: "error", text: "Database error." });
        return res.redirect(`/inv/edit/${vehicleData.inv_id}`);
    }
};


module.exports = invCont;
