// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invDetailController = require("../controllers/invDetail");
const validation = require("../utilities/inventory-validation");
const utilities = require("../utilities/index");

// Route to build inventory by classification view (Pública)
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by detail view (Pública)
router.get("/detail/:vehicleId", invDetailController.getVehicleDetail);

// Route to build the management view (Solo Admin o Empleado)
router.get("/", utilities.checkAdminOrEmployee, invController.buildManagementView);

// Ruta para mostrar la vista de agregar clasificación (Solo Admin o Empleado)
router.get("/add-classification", utilities.checkAdminOrEmployee, invController.buildAddClassificationView);

// Ruta para procesar la nueva clasificación (Solo Admin o Empleado)
router.post("/add-classification",
    utilities.checkAdminOrEmployee,
    validation.classificationRules(),
    validation.checkClassificationData,
    invController.addClassification
);

// Route to display add inventory form (Solo Admin o Empleado)
router.get("/add-inventory", utilities.checkAdminOrEmployee, invController.buildAddInventoryView);

// Route to handle adding inventory (Solo Admin o Empleado)
router.post("/add-inventory",
    utilities.checkAdminOrEmployee,
    validation.inventoryRules(),
    validation.checkInventoryData,
    invController.addInventory
);

// Route to classification id (AJAX request, Pública)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to display edit inventory form (Solo Admin o Empleado)
router.get("/edit/:inventory_id", utilities.checkAdminOrEmployee, invController.buildEditInventoryView);

// Route to handle updating inventory (Solo Admin o Empleado)
router.post("/update",
    utilities.checkAdminOrEmployee,
    validation.inventoryRules(),
    validation.checkUpdateData,
    invController.updateInventory
);

// Route to display delete confirmation view (Solo Admin o Empleado)
router.get("/delete/:inventory_id", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildDeleteConfirmationView));

// Route to handle deleting inventory (Solo Admin o Empleado)
router.post("/delete", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.deleteInventory));

module.exports = router;
