const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get classification by ID
 * ************************** */
async function getClassificationById(classificationId) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.classification WHERE classification_id = $1",
      [classificationId]
    );
    return result.rows[0]; // Devuelve el primer resultado encontrado o undefined si no hay resultados
  } catch (error) {
    console.error("Error fetching classification by ID:", error);
    throw error;
  }
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

/* ***************************
 *  Get Inventory Item by ID
 * ************************** */
async function getInventoryById(inv_id) {
  try {
      const result = await pool.query("SELECT * FROM inventory WHERE inv_id = $1", [inv_id]);
      return result.rows[0];
  } catch (error) {
      console.error("Error getting inventory by ID:", error);
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("Delete Inventory Error: ", error);
    throw error;
  }
}

module.exports = { getClassifications, 
                    getClassificationById, 
                    getInventoryByClassificationId, 
                    getVehicleById, 
                    insertClassification, 
                    insertInventory, 
                    getInventoryById, 
                    updateInventory,
                    deleteInventory};
