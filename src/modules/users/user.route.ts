import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth.middleware";

const router = express.Router();

//* define user CRUD routes here

//? route => /api/v1/auth/signup
router.post("/auth/signup", userController.createUser);

//? route => /api/v1/users
router.get("/users", auth("admin"), userController.getAllUsers);

//? route => /api/v1/users/1
router.get(
  "/users/:userId",
  auth("admin", "customer"),
  userController.getUserById
);

//? route => /api/v1/users/1
router.put("/users/:userId", userController.updateUserById);

//? route => /api/v1/users/1
router.delete("/users/:userId", userController.deleteUserById);

export const userRouter = router;
