import express, { Request, Response } from "express";
import { userController } from "./user.controller";

const router = express.Router();

//* Define user CRUD routes here
//? /api/v1/auth/signup
router.post("/auth/signup", userController.createUser);

export const userRouter = router;
