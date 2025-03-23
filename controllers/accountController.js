const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
    try {
        let nav = await utilities.getNav();
        //let loginForm = utilities.buildLoginForm(); 
        res.render("account/login", {
            title: "Login",
            nav,
            //loginForm, 
            messages: req.flash("notice"),
            errors: null,
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

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.");
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        });
    }

    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password;

            // save login
            req.session.account_id = accountData.account_id; // id
            req.session.account_name = accountData.account_firstname; // name
            req.session.account_type = accountData.account_type; //account type
            req.session.is_logged_in = true; // is login true or false

            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });

            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
            }

            return res.redirect("/account/");
        } else {
            req.flash("notice", "Please check your credentials and try again.");
            return res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        req.flash("notice", "Unexpected error during login.");
        return res.status(500).redirect("/account/login");
    }
}




/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
    try {
        let nav = await utilities.getNav();
        res.render("account/account-management", {
            title: "Account Management",
            nav,
            account_id: req.session.account_id,
            account_name: req.session.account_name,
            account_type: req.session.account_type,
        });
    } catch (error) {
        next(error);
    }
}

/* ****************************************
 * Logout
 * *************************************** */

async function logout(req, res) {
    req.session.destroy(() => {
        res.clearCookie("jwt"); 
        res.redirect("/");
    });
}


/**
 * Deliver account update view
 */
async function buildAccountUpdate(req, res, next) {
    try {
        let nav = await utilities.getNav();
        const accountData = await accountModel.getAccountById(req.params.id); // Obtener id de params
        if (!accountData) {
            req.flash("notice", "Account not found.");
            return res.redirect("/account/");
        }
        res.render("account/update-account", { // Asegúrate de que el nombre del archivo sea correcto
            title: "Update Account",
            nav,
            account: accountData, // Pasar objeto `account`
            messages: req.flash("notice"),
            errors: null,
        });
    } catch (error) {
        next(error);
    }
}


/**
 * Process account information update
 */
async function updateAccountInfo(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email } = req.body;
    const account_id = req.session.account_id;

    try {
        const result = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
        if (result.rowCount > 0) {
            req.flash("notice", "Account information updated successfully.");
        } else {
            req.flash("notice", "No changes were made or update failed.");
        }
        return res.redirect("/account/");
    } catch (error) {
        req.flash("notice", "Unexpected error during update.");
        return res.redirect("/account/update-account");
    }
}

/**
 * Process password update
 */
async function updatePassword(req, res) {
    let nav = await utilities.getNav();
    const { new_password } = req.body;
    const account_id = req.session.account_id;

    try {
        const hashedPassword = bcrypt.hashSync(new_password, 10);
        const result = await accountModel.updatePassword(account_id, hashedPassword);
        if (result.rowCount > 0) {
            req.flash("notice", "Password updated successfully.");
        } else {
            req.flash("notice", "Password update failed.");
        }
        return res.redirect("/account/");
    } catch (error) {
        req.flash("notice", "Unexpected error during password update.");
        return res.redirect("/account/update");
    }
}

module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    buildAccountManagement,
    logout,
    buildAccountUpdate,
    updateAccountInfo,
    updatePassword,
};