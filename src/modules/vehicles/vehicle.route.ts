import express from "express";
import auth from "../../middleware/auth.middleware";
import { vehicleController } from "./vehicle.controller";

const router = express.Router();

//? creating vehicle route only for admin
router.post("/", auth("admin"), vehicleController.createVehicle);

//? get all vehicles route
router.get("/", vehicleController.getAllVehicles);

router.get("/:vehicleId", vehicleController.getSingleVehicle);

export const vehicleRouter = router;
