const invModel = require("../models/inventory-model");
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

        res.render("./inventory/detail", {
            title: "",
            nav,
            vehicleDetail, 
        });
    } catch (error) {
        console.error("Error al obtener detalles del vehículo:", error);
        res.status(500).send("Error en el servidor");
    }
};

module.exports = invDetailCont;


