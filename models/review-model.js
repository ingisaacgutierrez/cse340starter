const pool = require("../database/index");

/* ===============================
   GET: Get reviews by inventory ID
=============================== */
async function getReviewsByInventoryId(inv_id) {
  try {
    const result = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_date, 
              a.account_id, a.account_firstname, a.account_lastname
       FROM review r
       JOIN account a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.review_date DESC`,
      [inv_id]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Error getting reviews: " + error.message);
  }
}

/* ===============================
   POST: Create new review
=============================== */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = `INSERT INTO review (review_text, inv_id, account_id)
                 VALUES ($1, $2, $3)
                 RETURNING *`;
    const result = await pool.query(sql, [review_text, inv_id, account_id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error adding review: " + error.message);
  }
}

/* ===============================
   GET: Get reviews by account ID
=============================== */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `SELECT r.review_id, r.review_text, r.review_date,
                        i.inv_id, i.inv_make, i.inv_model
                 FROM review r
                 JOIN inventory i ON r.inv_id = i.inv_id
                 WHERE r.account_id = $1
                 ORDER BY r.review_date DESC`;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    throw new Error("Error getting user reviews: " + error.message);
  }
}

/* ===============================
   GET: Get review by ID
=============================== */
async function getReviewById(review_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM review WHERE review_id = $1`,
      [review_id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error getting review: " + error.message);
  }
}

/* ===============================
   PUT: Update review
=============================== */
async function updateReview(review_text, review_id) {
  try {
    const result = await pool.query(
      `UPDATE review SET review_text = $1, review_date = now()
       WHERE review_id = $2 RETURNING *`,
      [review_text, review_id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating review: " + error.message);
  }
}

/* ===============================
   DELETE: Delete review
=============================== */
async function deleteReview(review_id) {
  try {
    const result = await pool.query(
      `DELETE FROM review WHERE review_id = $1 RETURNING *`,
      [review_id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error deleting review: " + error.message);
  }
}

module.exports = {
  getReviewsByInventoryId,
  addReview,
  getReviewsByAccountId,
  getReviewById,
  updateReview,
  deleteReview,
};

