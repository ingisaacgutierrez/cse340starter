const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


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
* ************************************ */
Util.buildLoginForm = function () {
    return `
        <form id="login-form" action="/account/login" method="POST">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>

            <button type="submit">Login</button>
        </form>

        <p>No account? <a href="/account/register">Sign up</a></p>
    `;
};


/* **************************************
* Build the Registration view HTML
* ************************************ */
Util.getRegisterForm = function (){
    return `
        <form action="/account/register" method="POST" class="register-form">
            <label for="first_name">First Name:</label>
            <input type="text" id="first_name" name="first_name" required>

            <label for="last_name">Last Name:</label>
            <input type="text" id="last_name" name="last_name" required>

            <label for="email">Email Address:</label>
            <input type="email" id="email" name="email" required>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required minlength="12" 
                    pattern="(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}" 
                    title="Must contain at least one number, one uppercase letter, one special character, and be at least 12 characters long">

            <button type="submit">Register</button>
        </form>
    `;
};



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util