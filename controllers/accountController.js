const utilities = require("../utilities/index");

async function buildLogin(req, res, next) {
    try {
        let nav = await utilities.getNav();
        let loginForm = utilities.buildLoginForm(); 
        res.render("account/login", {
            title: "Login",
            nav,
            loginForm, 
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { buildLogin };


