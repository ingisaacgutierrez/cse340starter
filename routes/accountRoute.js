const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/index');
const regValidate = require('../utilities/account-validation');

// GET route for login page
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// GET route for registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// POST route for registration function
router.post('/register', utilities.handleErrors(accountController.registerAccount));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData, 
    utilities.handleErrors(accountController.accountLogin) // Maneja los errores de ejecución
);


// routes/accountRoute.js
router.get("/", utilities.handleErrors(accountController.buildAccountManagement));

//logut
router.get("/logout", accountController.logout);

// Account update view
router.get("/update-account/:account_id", utilities.handleErrors(accountController.buildUpdate));

// Process account update
router.post(
    "/update", 
    regValidate.updateAccountRules(), 
    regValidate.checkUpdateAccountData, 
    utilities.handleErrors(accountController.updateAccount)
);

// Process password update
router.post(
    "/changePassword", 
    regValidate.updatePasswordRules(), 
    regValidate.checkUpdatePasswordData, 
    utilities.handleErrors(accountController.changePassword)
);



module.exports = router;



