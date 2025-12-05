import express from "express";
import { authController } from "./auth.controller";

const router = express.Router();

//? auth route
//?  /api/v1/auth/signin
router.post("/signin", authController.signIn);

export const authRouter = router;
