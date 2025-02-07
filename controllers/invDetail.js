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
        const nav = await utilities.getNav(); // Genera la navegación

        if (!vehicle) {
            return res.status(404).send("Vehículo no encontrado");
        }

        res.render("./inventory/detail", {
            title: `${vehicle.inv_make} ${vehicle.inv_model}`,
            nav,
            vehicle,
        });
    } catch (error) {
        console.error("Error obteniendo detalles del vehículo:", error);
        res.status(500).send("Error en el servidor");
    }
};

module.exports = invDetailCont;


