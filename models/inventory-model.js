const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle details by ID
 * ************************** */
async function getVehicleById(vehicleId) {
  try {
      const sql = `SELECT * FROM public.inventory WHERE inv_id = $1`;
      const result = await pool.query(sql, [vehicleId]);
      return result.rows[0];
  } catch (error) {
      console.error("Error retrieving vehicle details:", error);
      return null;
  }
}


/* ***************************
 *  Insert new classification
 * ************************** */
async function insertClassification(classification_name) {
  try {
      const sql = "INSERT INTO public.classification (classification_name) VALUES ($1)";
      return await pool.query(sql, [classification_name]);
  } catch (error) {
      console.error("Error inserting classification:", error);
  }
}

/**
 * Insert a new vehicle into inventory
 */
async function insertInventory(vehicleData) {
  try {
      const sql = `INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING inv_id`;
      
      const values = [
          vehicleData.inv_make,
          vehicleData.inv_model,
          vehicleData.inv_year,
          vehicleData.inv_description,
          vehicleData.inv_image,
          vehicleData.inv_thumbnail,
          vehicleData.inv_price,
          vehicleData.inv_miles,
          vehicleData.inv_color,
          vehicleData.classification_id
      ];

      const result = await pool.query(sql, values);
      return result.rows[0];
  } catch (error) {
      console.error("Error inserting inventory item:", error);
      return null;
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById, insertClassification, insertInventory };
