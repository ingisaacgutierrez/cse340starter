const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities/");
const reviewValidation = require("../utilities/review-validation");

/* ========== Agregar nueva reseña ========== */
router.post(
  "/add",
  utilities.checkLogin,
  reviewValidation.reviewRules(),
  reviewValidation.checkReviewData,
  reviewController.addReview
);

/* ========== Vista para editar una reseña ========== */
router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  reviewController.editReviewView
);

/* ========== Actualizar reseña ========== */
router.post(
  "/update",
  utilities.checkLogin,
  reviewValidation.reviewRules(),
  reviewValidation.checkReviewData,
  reviewController.updateReview
);

/* ========== Eliminar reseña ========== */
router.post(
  "/delete",
  utilities.checkLogin,
  reviewController.deleteReview
);

module.exports = router;
