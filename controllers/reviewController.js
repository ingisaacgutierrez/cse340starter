// reviewController.js
const utilities = require("../utilities/index");
const reviewModel = require("../models/review-model");

/* ****************************************
 *  Add new review
 * *************************************** */
async function addReview(req, res) {
  const { review_text, inv_id, account_id } = req.body;

  try {
    await reviewModel.addReview(review_text, inv_id, account_id);
    req.flash("notice", "Review added successfully.");
    res.redirect("/inv/detail/" + inv_id);
  } catch (error) {
    console.error("Error adding review:", error);
    req.flash("notice", "Error adding review.");
    res.redirect("/inv/detail/" + inv_id);
  }
}

/* ****************************************
 *  Show view to edit review
 * *************************************** */
async function editReviewView(req, res) {
  const review_id = req.params.review_id;

  try {
    const review = await reviewModel.getReviewById(review_id);
    if (!review) {
      req.flash("notice", "Review not found.");
      return res.redirect("/account/");
    }

    if (review.account_id != res.locals.accountData.account_id) {
      req.flash("notice", "You do not have permission to edit this review.");
      return res.redirect("/account/");
    }

    const nav = await utilities.getNav();

    res.render("account/edit-review", {
      title: "Edit Review",
      nav,
      review,
      errors: null,
    });
  } catch (error) {
    console.error("Error loading edit view:", error);
    req.flash("notice", "Error loading the edit view.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Update review
 * *************************************** */
async function updateReview(req, res) {
  const { review_id, review_text } = req.body;

  try {
    await reviewModel.updateReview(review_text, review_id);
    req.flash("notice", "Review updated.");
    res.redirect("/account/");
  } catch (error) {
    console.error("Error updating the review:", error);
    req.flash("notice", "Error updating the review");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Delete review
 * *************************************** */
async function deleteReview(req, res) {
  const { review_id } = req.body;

  try {
    await reviewModel.deleteReview(review_id);
    req.flash("notice", "Review deleted.");
    res.redirect("/account/");
  } catch (error) {
    console.error("Error deleting review:", error);
    req.flash("notice", "Error deleting review.");
    res.redirect("/account/");
  }
}

module.exports = {
  addReview,
  editReviewView,
  updateReview,
  deleteReview,
};


