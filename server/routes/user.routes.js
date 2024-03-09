const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

router.post(
  "/signup",
  [check("email", "Email is invalid").isEmail(), check("password", "Password must be 8 characters or more").isLength({ min: 8 })],
  (req, res) => {
    let response_data = { status: false, result: {}, error: null };

    try {
      const { email, password } = req.body;

      /* Check if data provided is valid */
      const validation_result = validationResult(req).errors;

      if(validation_result.length) {
        validation_result.forEach(error => {
          response_data.result[error.path] = error.msg;
        });
      } else {

      }
    } catch (error) {
      response_data.error = error?.message;
    }

    res.json(response_data);
  }
);

module.exports = router;
