const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")


/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
    try {
        let nav = await utilities.getNav();
        let loginForm = utilities.buildLoginForm(); 
        res.render("account/login", {
            title: "Login",
            nav,
            loginForm, 
            messages: req.flash("notice")
        });
    } catch (error) {
        next(error);
    }
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    let registerForm = utilities.getRegisterForm();

    res.render("account/register", {
        title: "Register",
        nav,
        registerForm,
        messages: req.flash("notice"),
        errors: null,
    });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();

    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    if (!account_firstname || !account_lastname || !account_email || !account_password) {
        req.flash("notice", "All fields are required.");
        return res.status(400).redirect("/account/register"); 
    }

    try {
        // Hash the password before storing
        let hashedPassword;
        try {
            hashedPassword = bcrypt.hashSync(account_password, 10);
        } catch (error) {
            req.flash("notice", "Sorry, there was an error processing the registration.");
            return res.status(500).render("account/register", {
                title: "Register",
                nav,
                messages: req.flash("notice"),
                errors: null,
            });
        }

        // Send hashed password to database
        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword  
        );

        if (regResult && regResult.rowCount > 0) {
            req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
            return res.redirect("/account/login"); 
        } else {
            req.flash("notice", "Sorry, the registration failed.");
            return res.status(501).redirect("/account/register");
        }
    } catch (error) {
        console.error("Error al registrar la cuenta:", error.message);
        req.flash("notice", "Unexpected error during registration.");
        return res.status(500).redirect("/account/register");
    }
}


module.exports = { buildLogin, buildRegister, registerAccount };



