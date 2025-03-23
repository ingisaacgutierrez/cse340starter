/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 ******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // Added cookie-parser

const pool = require("./database/");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities/");

// Import Routes
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const errorRoute = require("./routes/errorRoute");

const app = express();

/* ***********************
 * View Engine & Layouts
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Middleware
 *************************/
// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Cookie Parser Middleware
app.use(cookieParser()); // Added middleware to use cookie-parser

// Session Middleware
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

//login save name 
app.use((req, res, next) => {
  res.locals.account_name = req.session.account_name || null;
  res.locals.account_type = req.session.account_type || null;
  res.locals.is_logged_in = req.session.is_logged_in || false;
  next();
});


// Express Messages Middleware
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Static Files Middleware
app.use(static);

// JWT Middleware
app.use(utilities.checkJWTToken);

/* ***********************
 * Routes
 *************************/
// Home Route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Account Route
app.use("/account", accountRoute);

// Inventory Route
app.use("/inv", inventoryRoute);

// Error Route
app.use("/error", errorRoute);

/* ***********************
 * 404 - Page Not Found (Must be the last route)
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});