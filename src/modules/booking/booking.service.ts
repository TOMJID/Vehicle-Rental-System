import pool from "../../config/db.config";

interface BookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

const createBooking = async (payload: BookingPayload) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //! checking vehicle availability & get price
    const vehicleRes = await client.query(
      `SELECT * FROM vehicles WHERE id = $1 FOR UPDATE`,
      [vehicle_id]
    );

    if (vehicleRes.rows.length === 0) {
      throw new Error("Vehicle not found");
    }

    const vehicle = vehicleRes.rows[0];

    //! check availability for the car
    if (vehicle.availability_status !== "available") {
      throw new Error("Vehicle is currently not available");
    }

    //! calculate price
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    //? calculate time difference in milliseconds
    const timeDiff = endDate.getTime() - startDate.getTime();

    //? convert to days. If 0 (same day return), charge for 1 day.
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;

    if (days < 0) {
      throw new Error("End date cannot be before start date");
    }

    const total_price = days * vehicle.daily_rent_price;

    //! creating the Booking
    const bookingRes = await client.query(
      `
      INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
      VALUES ($1, $2, $3, $4, $5, 'active') 
      RETURNING *
      `,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    const newBooking = bookingRes.rows[0];

    //!  Update Vehicle Status to booked
    await client.query(
      `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
      [vehicle_id]
    );

    //* commit transaction
    await client.query("COMMIT");

    //! return the full booking data
    return {
      ...newBooking,
      vehicle: {
        vehicle_name: vehicle.vehicles_name,
        daily_rent_price: vehicle.daily_rent_price,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const bookingService = {
  createBooking,
};
