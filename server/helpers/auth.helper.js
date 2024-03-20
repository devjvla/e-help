import JWT from "jsonwebtoken";
import AppConstants from "../config/constants.js";

class AuthHelper {
  /**
  * DOCU: This function handles the creation of JWT.
  * Last Updated Date: March 18, 2024
  * @async
  * @function
  * @param {object}
  * @returns {object} - {status, result, error}
  * @memberOf AuthHelper    
  * @author JV Abengona
  **/
  createToken = async (user_data) => {
    let response_data = { status: false, result: {}, error: null }

    try {
      if(!user_data || !Object.keys(user_data).length) {
        throw new Error("A token cannot be created because User data is not found.");
      }

      let token = await JWT.sign(user_data, process.env.JWT_SECRET, { expiresIn: AppConstants.JWT_TOKEN_EXPIRATION });

      response_data.status = true;
      response_data.result = token;
    } catch (error) {
      response_data.error = error.message;
    }

    return response_data;
  }
}

export default AuthHelper;