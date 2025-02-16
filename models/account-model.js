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

module.exports = { registerAccount };