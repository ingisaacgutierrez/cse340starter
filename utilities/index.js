const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>";
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>";
        list += "</li>";
    });
    list += "</ul>";

    return list;
};



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
            grid += '<li>'
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
        } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
        }
        return grid
}


/* **************************************
* Build the Detail view HTML
* ************************************ */
Util.buildVehicleDetail = function (vehicle) {
    if (!vehicle) {
        return `<p>No details available</p>`;
    }

    return `
        <div class="vehicle-detail">
            <!-- Left Column: Title and Image -->
            <div>
                <h1>${vehicle.inv_make} ${vehicle.inv_model} - ${vehicle.inv_year}</h1>
                <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
            </div>

            <!-- Right Column: Details -->
            <div class="vehicle-info">
                <p><strong>Description:</strong> ${vehicle.inv_description}</p>
                <p><strong>Miles:</strong> ${vehicle.inv_miles} miles</p>
                <p><strong>Color:</strong> ${vehicle.inv_color}</p>
                <p class="price"><strong>Price:</strong> $${vehicle.inv_price}</p>
            </div>
        </div>
    `;
};

/* **************************************
* Build the Login view HTML

Util.buildLoginForm = function () {
    return `
        <form id="login-form" action="/account/login" method="post">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required minlength="12" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$">
            <small class="password-requirements">
                * Password must be at least 12 characters long and include at least one uppercase letter, one number, and one special character.
            </small>

            <button type="submit">Login</button>
        </form>

        <p>No account? <a href="/account/register">Sign up</a></p>
    `;
};
* ************************************ */



/* **************************************
* Build the Registration view HTML
* ************************************ */
Util.getRegisterForm = function () {
    return `
        <form action="/account/register" method="POST" class="register-form">
            <label for="first_name">First Name:</label>
            <input type="text" id="first_name" name="account_firstname" required">

            <label for="last_name">Last Name:</label>
            <input type="text" id="last_name" name="account_lastname" required">

            <label for="email">Email Address:</label>
            <input type="email" id="email" name="account_email" required">

            <label for="password">Password:</label>
            <input type="password" id="password" name="account_password" required minlength="12" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$">
            <small class="password-requirements">
                * Password must be at least 12 characters long and include at least one uppercase letter, one number, and one special character.
            </small>

            <button type="submit">Register</button>
        </form>
    `;
};

/* **************************************
* Build the Management view HTML
* ************************************ */
Util.buildManagementView = function () {
    return `
        <nav class="management-nav">
            <ul>
                <li><a href="/inv/add-classification" title="Añadir nueva clasificación">Add new Classification</a></li>
                <li><a href="/inv/add-inventory" title="Agregar nuevo inventario">Add new Vehicule</a></li>
            </ul>
        </nav>
    `;
};

/* **************************************
* Build the Add Classification view HTML
* ************************************ */
Util.buildAddClassificationForm = function () {
    return `
        <h2>Add New Classification</h2>
        <form class="add-classification-form" action="/inv/add-classification" method="post">
            <label for="classification_name">Classification Name:</label>
            <input type="text" id="classification_name" name="classification_name" required 
                    pattern="^[a-zA-Z0-9]+$" title="No spaces or special characters allowed">
            <small>* No spaces or special characters allowed.</small>
            <button type="submit">Add Classification</button>
        </form>
    `;
};


/* **************************************
* Build the Add Inventory Form HTML
* ************************************ */
Util.buildAddInventoryForm = function (classifications) {
    let classificationOptions = classifications.map(classification => `
        <option value="${classification.classification_id}">${classification.classification_name}</option>
    `).join('');

    return `
        <form action="/inv/add-inventory" method="post" class="add-inventory-form">
            <label for="inv_make">Make:</label>
            <input type="text" id="inv_make" name="inv_make" required>

            <label for="inv_model">Model:</label>
            <input type="text" id="inv_model" name="inv_model" required>

            <label for="inv_year">Year:</label>
            <input type="number" id="inv_year" name="inv_year" required min="1900" max="2099">


            <label for="inv_description">Description:</label>
            <textarea id="inv_description" name="inv_description" required></textarea>

            <label for="inv_image">Image URL:</label>
            <input type="text" id="inv_image" name="inv_image" required value="/images/vehicles/no-image.png">

            <label for="inv_thumbnail">Thumbnail URL:</label>
            <input type="text" id="inv_thumbnail" name="inv_thumbnail" required value="/images/vehicles/no-image.png">


            <label for="inv_price">Price:</label>
            <input type="number" id="inv_price" name="inv_price" required>

            <label for="inv_miles">Miles:</label>
            <input type="number" id="inv_miles" name="inv_miles" required>

            <label for="inv_color">Color:</label>
            <input type="text" id="inv_color" name="inv_color" required>

            <label for="classification_id">Classification:</label>
            <select id="classification_id" name="classification_id" required>
                <option value="" disabled selected>Choose a classification</option>
                ${classificationOptions}
            </select>

            <button type="submit">Add Vehicle</button>
        </form>
    `;
};


/* ************************
 * Constructs the classification dropdown
 ************************** */
Util.buildClassificationDropdown = async function (selectedId = null) {
    let data = await invModel.getClassifications();
    let dropdown = '<select id="classification_id" name="classification_id" required>';
    dropdown += '<option value="">Select a classification</option>';

    data.rows.forEach((row) => {
        let selected = selectedId == row.classification_id ? "selected" : "";
        dropdown += `<option value="${row.classification_id}" ${selected}>${row.classification_name}</option>`;
    });

    dropdown += "</select>";
    return dropdown;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in");
                    res.clearCookie("jwt");
                    return res.redirect("/account/login");
                }
                res.locals.accountData = accountData;
                res.locals.loggedin = 1;
                next();
            }
        );
    } else {
        next();
    }
};

/* **************************************
* Build the Management Ac count View
* ************************************ */
Util.buildManagementAccountView = function () {
    return `
        <h1>You are login</h1>
    `;
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
        } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
        }
}


/* ****************************************
 * Build Classification List
 * ************************************ */
Util.buildClassificationList = async function (selectedClassificationId = null) {
    let data = await invModel.getClassifications();
    let selectedClassification = selectedClassificationId
        ? await invModel.getClassificationById(selectedClassificationId)
        : null;

    let list = '<select id="classificationList" name="classification_id">';
    
    if (selectedClassification) {
        list += `<option value="${selectedClassification.classification_id}" selected>
                    ${selectedClassification.classification_name}
                </option>`;
    } else {
        list += '<option value="">Choose a Classification</option>';
    }

    data.rows.forEach((classification) => {
        if (!selectedClassification || classification.classification_id !== selectedClassification.classification_id) {
            list += `<option value="${classification.classification_id}">${classification.classification_name}</option>`;
        }
    });

    list += "</select>";
    return list;
};


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util