const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/index');

// GET route for login page
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// GET route for registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// POST route for registration function
router.post('/register', utilities.handleErrors(accountController.registerAccount));

module.exports = router;


