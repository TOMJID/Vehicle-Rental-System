import express, { Request, Response } from "express";
import { initDB } from "./config/db.config";
import { userRouter } from "./modules/users/user.route";

const app = express();
app.use(express.json());
//? initialize database
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

//* user CRUD route
app.use("/api/v1", userRouter);

export default app;
