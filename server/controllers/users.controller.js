import UserModel from "../models/user.model.js";

/** 
* @class UsersController
* Handles all User-related API calls
* Last Updated Date: March 12, 2024
* @author JV Abengona
*/
class UsersController {
  /**
  * DOCU: This function will check if the email exists.
  * If it exists, return a message that email is already registerd
  * If not, create a new user record and return JWT token to user to proceed to login
  * Triggered by: POST request to /signup  <br>
  * Last Updated Date: March 16, 2024
  * @async
  * @function
  * @memberOf DatabaseModel
  * @return {db_connection} - returns database connection
  * @author JV Abengona
  */
  signupUser = async (req, res, validationResult) => {
    let response_data = { status: false, result: {}, error: null };

    try {
      /* Check if data provided is valid */
      const validation_result = validationResult(req).errors;

      if(validation_result.length) {
        validation_result.forEach(error => {
          response_data.result[error.path] = error.msg;
        });
      } else {
        /* Proceed to sign up */
        let userModel = new UserModel();
        response_data = await userModel.signupUser(req.body);
      }
    } catch (error) {
      response_data.error = error.message;
    }

    res.json(response_data);
  }
}

export default (function user(){
  return new UsersController();
})();