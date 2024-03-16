import { format as mysqlFormat } from "mysql2";
import moment from "moment/moment.js";

import DatabaseModel from "./databse.model/database.model.js";

import QueryHelper from "../helpers/query.helper.js";

/** 
* @class UserModel
* Handles all User-related methods
* Last Updated Date: March 12, 2024
* @author JV Abengona
*/
class UserModel extends DatabaseModel {
  /**
  * DOCU: Function will check if email address exists in the database.
  * Proceed in creating a user record if email address doesn't exist in the database.
  * Triggered by: UsersController.signUpUser <br>
  * Last Updated Date: March 16, 2024
  * @async
  * @function
  * @memberOf DatabaseModel
  * @param {object} - params (e.g. id, first_name, last_name, or email_address)
  * @return {db_connection} - returns database connection
  * @author JV Abengona
  */
  signupUser = async (params) => {
    let response_data = { status: false, result: {}, error: null };

    try {
      const { first_name, last_name, email_address, password } = params;

      /* Check if email_address exists in the database */
      let get_user = await this.getUser({ email_address });

      /* 
      Immediately throw an error when get user objet has value and password has value.
      Password is empty if user used sign up with Google
      */
      if(Object.keys(get_user.result).length && password) {
        throw new Error("Email address is already registered.");
      }

      let created_at        = moment().format("YYYY-MM-DD HH:mm:ss");
      let create_user_query = mysqlFormat("INSERT INTO users (first_name, last_name, email_address, created_at, updated_at) VALUES (?, ?, ?, ?, NOW());", [first_name, last_name, email_address, created_at]);
      let create_user       = await this.executeQuery("User Model | signupUser", create_user_query);

      if(!create_user) {
        throw new Error("An error occured while creating user record.");
      }
      
      /* Update user record with a encrypt password using created_at as the salt */
      let encrypt_user_password = await this._encryptPassword({ user_id: create_user.insertId, salt: created_at, password });

      if(!encrypt_user_password.status) {
        throw new Error(encrypt_user_password.error);
      }

      response_data.status = true;
      response_data.result = {
        user_id: create_user.insertId,
        first_name, last_name
      }
    } catch (error) {
      response_data.error = error.message;
    }

    return response_data;
  }

  /**
  * DOCU: Function for fetching a user record
  * Triggered by: UsersController.signUpUser <br>
  * Last Updated Date: March 16, 2024
  * @async
  * @function
  * @memberOf DatabaseModel
  * @param {object} - params (e.g. id, first_name, last_name, or email_address)
  * @return {db_connection} - returns database connection
  * @author JV Abengona
  */
  getUser = async (params) => {
    let response_data = { status: false, result: {}, error: null };

    try {
      /* build query params */
      let queryHelper        = new QueryHelper();
      let build_query_params = await queryHelper.buildQueryParams(params);

      if(!build_query_params.status) {
        throw new Error(build_query_params.error);
      }

      let { where_clause, bind_params } = build_query_params.result; 

      const get_user_query = mysqlFormat(`SELECT id FROM users WHERE${where_clause};`, bind_params);
      const [get_user]     = await this.executeQuery("UserModel | getUser", get_user_query);

      response_data.status = true;
      response_data.result = get_user || {}; // Only pass value of get_user if it's not undefined/empty
    } catch (error) {
      response_data.error = error.message;
    }

    return response_data;
  }

  /**
  * DOCU: Function will update user record with an encrypted password
  * Triggered by: UsersController._encryptPassword <br>
  * Last Updated Date: March 16, 2024
  * @async
  * @function
  * @memberOf DatabaseModel
  * @param {object} - params (user_id, salt, password)
  * @return {db_connection} - returns database connection
  * @author JV Abengona
  */
  _encryptPassword = async (params) => {
    let response_data = { status: false, result: {}, error: null };
    
    try {
      let { user_id, salt, password } = params;

      let encrypt_user_password_query = mysqlFormat("UPDATE users SET password = SHA1(CONCAT(?, ?)) WHERE id = ?;", [salt, password, user_id]);
      let encrypt_user_password       = await this.executeQuery("UserModel | _encryptPassword", encrypt_user_password_query);

      if(!encrypt_user_password) {
        throw new Error("An error occured while updating user password.");
      }

      response_data.status = true;
    } catch (error) {
      response_data.error = error.message;
    }

    return response_data;
  }
}

export default UserModel;