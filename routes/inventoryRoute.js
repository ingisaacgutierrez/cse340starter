// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invDetailController = require("../controllers/invDetail");


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by detail view
router.get("/detail/:vehicleId", invDetailController.getVehicleDetail);

module.exports = router;