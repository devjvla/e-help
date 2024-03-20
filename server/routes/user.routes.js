import { Router } from "express";
import { validationResult } from "express-validator";
import ValidationHelper from "../helpers/validation.helper.js";
import UsersController from "../controllers/users.controller.js";

const UserRouter = Router();

UserRouter.post("/signup", ValidationHelper.SignupForm, (req, res) => UsersController.signupUser(req, res, validationResult));
UserRouter.post("/signin", ValidationHelper.SigninForm, (req, res) => UsersController.signinUser(req, res, validationResult))

export default UserRouter;
