import mysql from "mysql2/promise";
import AppConstants from "../../config/constants.js";

/** 
* @class DatabaseModel
* Handles all Database-related features
* (i.e. creating db connection , executing query, and transactions). <br>
* Last Updated Date: March 12, 2024
* @author JV Abengona
*/
class DatabaseModel {
  constructor() {
    this.createPoolConnection();
  }

  /**
  * DOCU: Function to create pool connection for mysql
  * Triggered: This is being called by the constructor.<br>
  * Last Updated Date: March 12, 2024
  * @async
  * @function
  * @memberOf DatabaseModel
  * @return {db_connection} - returns database connection
  * @author JV Abengona
  */
  createPoolConnection = async () => {
    this.db_connection = mysql.createPool(AppConstants.DB_CONFIG);
  }

  /**
  * DOCU: Function to execute mysql query from model
  * Triggered: This is being called by the models.<br>
  * Last Updated Date: March 12, 2024
  * @async
  * @function
  * @memberOf DatabaseModel
  * @return {array} - returns an array that contains an object
  * @author JV Abengona
  */
  executeQuery = async (keyword, query) => {
    try {
      await this.db_connection.getConnection((error, connection) => {
        if(error) { throw new Error(error) }
      });

      let [query_result, ] = await this.db_connection.query(query);

      return query_result;
    } catch (error) {
      return error;
    }
  }
}

export default DatabaseModel;