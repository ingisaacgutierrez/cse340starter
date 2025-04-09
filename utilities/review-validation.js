const { body, validationResult } = require("express-validator");
const utilities = require(".");
const validate = {};

// Validation rules for adding/editing reviews
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Review text must be at least 3 characters long."),
  ];
};

// Middleware to check for errors
validate.checkReviewData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = utilities.getNav();
    const itemId = req.body.inv_id;
    const accountId = req.body.account_id;
    const screenName = req.body.screen_name;
    const review_text = req.body.review_text;

    return res.render("inventory/detail", {
      title: "Vehicle Detail",
      nav,
      errors: errors.array(),
      itemId,
      accountId,
      screenName,
      review_text,
    });
  }
  next();
};

module.exports = validate;

