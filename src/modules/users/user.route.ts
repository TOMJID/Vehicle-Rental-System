import express, { Request, Response } from "express";
import { userController } from "./user.controller";

const router = express.Router();

//* define user CRUD routes here

//? route => /api/v1/auth/signup
router.post("/auth/signup", userController.createUser);

//? route => /api/v1/users
router.get("/users", userController.getAllUsers);

//? route => /api/v1/users/1
router.get("/users/:userId", userController.getUserById);
export const userRouter = router;
