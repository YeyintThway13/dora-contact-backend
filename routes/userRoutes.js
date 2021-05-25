import express from "express";
import {
  signinUser,
  signoutUser,
  signupUser,
} from "../controllers/userControllers.js";
import auth from "../utilities/auth.js";
const router = express.Router();

router.post("/login", signinUser);

router.post("/register", signupUser);

router.post("/signout", auth, signoutUser);

export default router;
