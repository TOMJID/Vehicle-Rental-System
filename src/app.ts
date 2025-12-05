import express from "express";
import { initDB } from "./config/db.config";
import { userRouter } from "./modules/users/user.route";
import { authRouter } from "./modules/auth/auth.route";

const app = express();

//? parse json
app.use(express.json());

//? initialize database
initDB();

//? auth route
app.use("/api/v1/auth", authRouter);

//* user CRUD route
app.use("/api/v1", userRouter);

export default app;
