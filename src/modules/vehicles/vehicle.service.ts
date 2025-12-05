import pool from "../../config/db.config";

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

export const vehicleService = {
  createVehicle,
};
