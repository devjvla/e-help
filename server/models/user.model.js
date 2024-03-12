import { format as mysqlFormat } from "mysql2";
import DatabaseModel from "./databse.model/database.model.js";

/** 
* @class UserModel
* Handles all User-related methods
* Last Updated Date: March 12, 2024
* @author JV Abengona
*/
class UserModel extends DatabaseModel {
  /**
  * DOCU: Function for fetching a user record
  * Triggered by: UsersController.signUpUser <br>
  * Last Updated Date: March 12, 2024
  * @async
  * @function
  * @memberOf DatabaseModel
  * @return {db_connection} - returns database connection
  * @author JV Abengona
  */
  getUser = async (params) => {
    let response_data = { status: false, result: {}, error: null };

    try {
      const get_user_query = mysqlFormat("SELECT id FROM users WHERE email_address = ?;", [params.email_address]);
      const [get_user]     = await this.executeQuery("UserModel | getUser", get_user_query);

      response_data.status = true;

      /* Only pass value of get_user if it's not undefined/empty */
      response_data.result = get_user || {};
    } catch (error) {
      throw new Error(error);
    }

    return response_data;
  }
}

export default UserModel;