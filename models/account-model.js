const pool = require("../database/");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = `
            INSERT INTO account 
            (account_firstname, account_lastname, account_email, account_password, account_type) 
            VALUES ($1, $2, $3, $4, 'Client') 
            RETURNING *;
        `;

        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);

        return result;
    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        return null; 
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
 * Return account data using account_id
 * ***************************** */
async function getAccountById(account_id) {
  try {
      const result = await pool.query(
          "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
          [account_id]
      );
      return result.rows[0];
  } catch (error) {
      return new Error("No matching account found");
  }
}

/* *****************************
* Update account information
* ***************************** */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
  try {
      const sql = `
          UPDATE account 
          SET account_firstname = $1, account_lastname = $2, account_email = $3 
          WHERE account_id = $4
          RETURNING *;
      `;
      const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
      return result;
  } catch (error) {
      console.error("Error updating account info:", error);
      return null;
  }
}

/* *****************************
* Update account password
* ***************************** */
async function updatePassword(account_id, new_password) {
  try {
      const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *;";
      const result = await pool.query(sql, [new_password, account_id]);
      return result;
  } catch (error) {
      console.error("Error updating password:", error);
      return null;
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccountInfo, updatePassword  };
