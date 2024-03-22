import { format as mysqlFormat } from "mysql2";
import moment from "moment/moment.js";

import DatabaseModel from "./databse.model/database.model.js";

/* Helpers */
import QueryHelper from "../helpers/query.helper.js";
import AuthHelper from "../helpers/auth.helper.js";

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
  * Triggered by: UsersController.signupUser <br>
  * Last Updated Date: March 18, 2024
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
      
      /* Update user record with a hashed password using created_at as the salt */
      if(password) {
        let hash_user_password = await this._hashPassword({ user_id: create_user.insertId, salt: created_at, password });
  
        if(!hash_user_password.status) {
          throw new Error(hash_user_password.error);
        }
      }

      /* Create token */
      let authHelper   = new AuthHelper();
      let create_token = await authHelper.createToken({ email_address });

      if(!create_token.status) {
        throw new Error(create_token.error);
      }

      response_data.status = true;
      response_data.result = {
        first_name, last_name,
        user_id: create_user.insertId,
        token: create_token.result
      }
    } catch (error) {
      response_data.error = error.message;
    }

    return response_data;
  }

  /**
  * DOCU: Function will fetch a user record that matches the given email address and password.
  * Triggered by: UsersController.signinUser <br>
  * Last Updated Date: March 22, 2024
  * @async
  * @function
  * @memberOf DatabaseModel
  * @param {object} - params (email_address, password)
  * @return {db_connection} - returns database connection
  * @author JV Abengona
  */
  signinUser = async (params) => {
    let response_data = { status: false, result: {}, error: null };

    try {
      let { email_address, password } = params;

      /* Get user using email_address and password */
      let get_user_query = mysqlFormat(`SELECT id, first_name, last_name FROM users WHERE email_address = ? AND password = SHA1(CONCAT(created_at, ?));`, [email_address, password]);
      let [get_user]     = await this.executeQuery("UserModel | SigninUser", get_user_query);

      if(!get_user) {
        throw new Error("Email address or password is incorrect.");
      }

      /* Create token */
      let authHelper   = new AuthHelper();
      let create_token = await authHelper.createToken({ email_address });

      if(!create_token.status) {
        throw new Error(create_token.error);
      }

      response_data.status = true;
      response_data.result = { 
        user_id: get_user.id,
        first_name: get_user.first_name, 
        last_name: get_user.last_name,
        token: create_token.result
      }
    } catch (error) {
      response_data.error = error.message;
    }

    return response_data;
  }

  /**
  * DOCU: Function for fetching a user record
  * Triggered by: UsersController.signUpUser <br>
  * Last Updated Date: March 17, 2024
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
      let build_where_clause = await queryHelper.buildWhereClause(params);

      if(!build_where_clause.status) {
        throw new Error(build_where_clause.error);
      }

      let { where_clause, bind_params } = build_where_clause.result; 

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
  * DOCU: Function will update user record with an hashed password
  * Triggered by: this.signupUser <br>
  * Last Updated Date: March 17, 2024
  * @async
  * @function
  * @memberOf DatabaseModel
  * @param {object} - params (user_id, salt, password)
  * @return {db_connection} - returns database connection
  * @author JV Abengona
  */
  _hashPassword = async (params) => {
    let response_data = { status: false, result: {}, error: null };
    
    try {
      let { user_id, salt, password } = params;

      let hash_user_password_query = mysqlFormat("UPDATE users SET password = SHA1(CONCAT(?, ?)) WHERE id = ?;", [salt, password, user_id]);
      let hash_user_password       = await this.executeQuery("UserModel | _hashPassword", hash_user_password_query);

      if(!hash_user_password) {
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