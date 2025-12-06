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
    `UPDATE vehicles SET vehicles_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );

  return result;
};
export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
};
