// controllers/invDetail.js
const invModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model");
const utilities = require("../utilities/");

const invDetailCont = {};

/* ***************************
 *  Get vehicle details by ID
 * *************************** */
invDetailCont.getVehicleDetail = async function (req, res, next) {
  try {
    const vehicleId = req.params.vehicleId;
    const vehicle = await invModel.getVehicleById(vehicleId);
    const nav = await utilities.getNav();
    const vehicleDetail = utilities.buildVehicleDetail(vehicle);

    if (!vehicle) {
      return res.status(404).send("Vehicle not found");
    }

    // Obtener reseñas del vehículo
    const reviewsRaw = await reviewModel.getReviewsByInventoryId(vehicleId);
    const reviews = reviewsRaw.map((r) => ({
      review_text: r.review_text,
      review_date: r.review_date,
      screen_name: `${r.account_firstname[0]}${r.account_lastname}`.replace(/\s+/g, "")
    }));

    const loggedin = res.locals.loggedin;
    let screen_name = "";
    let accountId = "";

    if (loggedin && res.locals.accountData) {
      const { account_firstname, account_lastname, account_id } = res.locals.accountData;
      screen_name = `${account_firstname[0]}${account_lastname}`.replace(/\s+/g, "");
      accountId = account_id;
    }

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleDetail,
      reviews,
      loggedin,
      screen_name,
      accountId,
      itemId: vehicleId,
      errors: null,
    });
  } catch (error) {
    console.error("Error getting vehicle details:", error);
    res.status(500).send("Server error");
  }
};

module.exports = invDetailCont;



