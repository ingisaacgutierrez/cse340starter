// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invDetailController = require("../controllers/invDetail");
const validation = require("../utilities/inventory-validation");
const utilities = require('../utilities/index');


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by detail view
router.get("/detail/:vehicleId", invDetailController.getVehicleDetail);
// Route to build the management view
router.get("/", invController.buildManagementView);
// Ruta para mostrar la vista de agregar clasificación
router.get("/add-classification", invController.buildAddClassificationView);
// Ruta para procesar la nueva clasificación
router.post("/add-classification", validation.classificationRules(), validation.checkClassificationData, invController.addClassification);
// Route to display add inventory form
router.get("/add-inventory", invController.buildAddInventoryView);
// Route to handle adding inventory
router.post("/add-inventory", validation.inventoryRules(), validation.checkInventoryData, invController.addInventory);
// Route to classificaiton id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


module.exports = router;