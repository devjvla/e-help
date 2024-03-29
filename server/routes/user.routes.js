import { Router } from "express";
import { validationResult } from "express-validator";
import ValidationHelper from "../helpers/validation.helper.js";
import UsersController from "../controllers/users.controller.js";

const UserRouter = Router();

UserRouter.post("/signup", ValidationHelper.SignupForm, (req, res) => UsersController.signUpUser(req, res, validationResult));

export default UserRouter;
