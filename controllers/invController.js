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

module.exports = invCont