import pool from "../../config/db.config";

//? create vehicle service
const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  //? checking type is any of the ['car', 'bike', 'van' or 'SUV']
  const validTypes = ["car", "bike", "van", "SUV"];
  if (!validTypes.includes(type as string)) {
    throw new Error(
      `Type must be one of the following: ${validTypes.join(", ")}`
    );
  }

  //? checking daily_rent_price is a positive number
  const isPositiveNumber = (value: unknown): value is number => {
    return Number.isFinite(value) && (value as number) > 0;
  };

  if (!isPositiveNumber(daily_rent_price)) {
    throw new Error("Daily rent price must be a positive number");
  }

  //? check availability_status is 'available' or 'booked'
  const validStatuses = ["available", "booked"];
  if (!validStatuses.includes(availability_status as string)) {
    throw new Error(
      `Availability status must be one of the following: ${validStatuses.join(
        " or "
      )}`
    );
  }

  //? check if vehicle with same registration number exists
  const existingVehicle = await pool.query(
    `SELECT * FROM vehicles WHERE registration_number=$1`,
    [registration_number]
  );
  if (existingVehicle.rows.length > 0) {
    throw new Error("Vehicle with this registration number already exists");
  }

  const result = await pool.query(
    `INSERT INTO vehicles (vehicles_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

//? get all vehicles service
const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

//? getting single vehicle
const getSingleVehicle = async (vehicleId: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicleId,
  ]);
  return result;
};

//? update vehicle
const updateVehicle = async (
  vehicleId: string,
  payload: Record<string, unknown>
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  //? checking type is any of the ['car', 'bike', 'van' or 'SUV']
  const validTypes = ["car", "bike", "van", "SUV"];
  if (!validTypes.includes(type as string)) {
    throw new Error(
      `Type must be one of the following: ${validTypes.join(", ")}`
    );
  }

  //? checking daily_rent_price is a positive number
  const isPositiveNumber = (value: unknown): value is number => {
    return Number.isFinite(value) && (value as number) > 0;
  };

  if (!isPositiveNumber(daily_rent_price)) {
    throw new Error("Daily rent price must be a positive number");
  }

  //? check availability_status is 'available' or 'booked'
  const validStatuses = ["available", "booked"];
  if (!validStatuses.includes(availability_status as string)) {
    throw new Error(
      `Availability status must be one of the following: ${validStatuses.join(
        " or "
      )}`
    );
  }

  const result = await pool.query(
    `UPDATE vehicles SET vehicles_name=$1, type=$2, daily_rent_price=$3, availability_status=$4 WHERE id=$5 RETURNING *`,
    [
      vehicle_name,
      type,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );

  return result;
};

//? delete vehicle
const deleteVehicle = async (vehicleId: string) => {
  // Check for active bookings
  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`,
    [vehicleId]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [
    vehicleId,
  ]);
  return result;
};
export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
