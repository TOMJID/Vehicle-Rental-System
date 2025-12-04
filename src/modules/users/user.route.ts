import express, { Request, Response } from "express";
import { userController } from "./user.controller";

const router = express.Router();

//* define user CRUD routes here
//? route => /api/v1/auth/signup
router.post("/auth/signup", userController.createUser);

router.get("/users", userController.getAllUsers);
export const userRouter = router;
