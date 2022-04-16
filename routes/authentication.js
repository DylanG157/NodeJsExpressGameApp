import express from "express";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import { validationModel } from "../models/auth-models.js";
import {
  checkValidation,
  sendError,
} from "../middleware/validation-handler.js";

const authenticationRouter = express.Router();
authenticationRouter.use(bodyParser.urlencoded({ extended: false }));
authenticationRouter.use(bodyParser.json());
// JWT token generation
async function userTokenGeneration(req, res, next) {
  try {
    const errors = checkValidation(req);
    if (!errors.isEmpty()) {
      sendError(res, errors);
    } else {
      const clientId = req.body.client_id;
      const clientSecret = req.body.client_secret;
      if (
        clientId === process.env.CLIENT_ID &&
        clientSecret === process.env.CLIENT_SECRET
      ) {
        const accessToken = jwt.sign(
          { clientId },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: process.env.TOKEN_EXPIRATION_TIME,
          }
        );
        res.json({ accessToken });
        next();
      } else {
        res.json({ errorMessage: APP_ERROR_MESSAGES.AUTH_FAILED });
      }
    }
  } catch (error) {
    next(error);
  }
}

authenticationRouter.post(
  "/token",
  validationModel("userTokenGeneration"),
  userTokenGeneration
);
export default authenticationRouter;
