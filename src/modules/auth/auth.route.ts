import express from "express";
import { authController } from "./auth.controller";

const router = express.Router();

//? signIn route
//?  /api/v1/auth/signin
router.post("/signin", authController.signIn);

router.post("/signup",authController.signUp);


export const authRouter = router;
