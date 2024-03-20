import UserModel from "../models/user.model.js";

/** 
* @class UsersController
* Handles all User-related API calls
* Last Updated Date: March 12, 2024
* @author JV Abengona
*/
class UsersController {
  /**
  * DOCU: This function will validate the input provided by the user
  * If valid, proceed to userModel.signupUser. If not, prompt user with an error message.
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
        /* Populate object to store input fields with errors */
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

  /**
  * DOCU: This function will validate if provided email address and password.
  * If valid, proceed to userModel.signinUser. If not, prompt user with an error message
  * Triggered by: POST request to /signup  <br>
  * Last Updated Date: March 20, 2024
  * @async
  * @function
  * @memberOf DatabaseModel
  * @return {db_connection} - returns database connection
  * @author JV Abengona
  */
  signinUser = async (req, res, validationResult) => {
    let response_data = { status: false, result: {}, error: null };

    try {
      /* Check if data provided is valid */
      const validation_result = validationResult(req).errors;

      if(validation_result.length) {
        /* Populate object to store input fields with errors */
        validation_result.forEach(error => {
          response_data.result[error.path] = error.msg;
        });
      } else {
        /* Proceed to sign in */
        let userModel = new UserModel();
        response_data = await userModel.signinUser(req.body);
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