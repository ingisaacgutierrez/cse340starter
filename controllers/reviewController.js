// reviewController.js
const utilities = require("../utilities/index");
const reviewModel = require("../models/review-model");

/* ****************************************
 *  Agregar nueva reseña
 * *************************************** */
async function addReview(req, res) {
  const { review_text, inv_id, account_id } = req.body;

  try {
    await reviewModel.addReview(review_text, inv_id, account_id);
    req.flash("notice", "Reseña agregada exitosamente.");
    res.redirect("/inv/detail/" + inv_id);
  } catch (error) {
    console.error("Error al agregar reseña:", error);
    req.flash("notice", "Error al agregar reseña.");
    res.redirect("/inv/detail/" + inv_id);
  }
}

/* ****************************************
 *  Mostrar vista para editar reseña
 * *************************************** */
async function editReviewView(req, res) {
  const review_id = req.params.review_id;

  try {
    const review = await reviewModel.getReviewById(review_id);
    if (!review) {
      req.flash("notice", "Reseña no encontrada.");
      return res.redirect("/account/");
    }

    if (review.account_id != res.locals.accountData.account_id) {
      req.flash("notice", "No tienes permiso para editar esta reseña.");
      return res.redirect("/account/");
    }

    const nav = await utilities.getNav();

    res.render("account/edit-review", {
      title: "Editar Reseña",
      nav,
      review,
      errors: null,
    });
  } catch (error) {
    console.error("Error al cargar vista de edición:", error);
    req.flash("notice", "Error al cargar la vista de edición.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Actualizar reseña
 * *************************************** */
async function updateReview(req, res) {
  const { review_id, review_text } = req.body;

  try {
    await reviewModel.updateReview(review_text, review_id);
    req.flash("notice", "Reseña actualizada.");
    res.redirect("/account/");
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    req.flash("notice", "Error al actualizar reseña.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Eliminar reseña
 * *************************************** */
async function deleteReview(req, res) {
  const { review_id } = req.body;

  try {
    await reviewModel.deleteReview(review_id);
    req.flash("notice", "Reseña eliminada.");
    res.redirect("/account/");
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    req.flash("notice", "Error al eliminar reseña.");
    res.redirect("/account/");
  }
}

module.exports = {
  addReview,
  editReviewView,
  updateReview,
  deleteReview,
};

