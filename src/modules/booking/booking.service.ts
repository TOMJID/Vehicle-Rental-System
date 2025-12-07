import pool from "../../config/db.config";

//? create booking service
const createBooking = async (payload: Record<string, any>) => {
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

//? get booking Role-based
const getBooking = async (userId: number, role: string) => {
  const client = await pool.connect();

  try {
    if (role === "admin") {
      const query = `
        SELECT 
          b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
          u.name as user_name, u.email as user_email,
          v.vehicles_name, v.registration_number
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
        ORDER BY b.id DESC;
      `;

      const result = await client.query(query);

      // Map DB rows to the Admin JSON structure
      return result.rows.map((row) => ({
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        customer: {
          name: row.user_name,
          email: row.user_email,
        },
        vehicle: {
          vehicle_name: row.vehicles_name, // Mapping 'vehicles_name' -> 'vehicle_name'
          registration_number: row.registration_number,
        },
      }));
    } else {
      const query = `
        SELECT 
          b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
          v.vehicles_name, v.registration_number, v.type
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
        ORDER BY b.id DESC;
      `;

      const result = await client.query(query, [userId]);

      return result.rows.map((row) => ({
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
          vehicle_name: row.vehicles_name,
          registration_number: row.registration_number,
          type: row.type,
        },
      }));
    }
  } catch (error: any) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

//? update booking
const updateBooking = async (
  bookingId: number,
  userId: number,
  role: string,
  newStatus: string
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //? check if booking exists
    const bookingRes = await client.query(
      `SELECT * FROM bookings WHERE id = $1 FOR UPDATE`,
      [bookingId]
    );

    if (bookingRes.rows.length === 0) {
      throw new Error("Booking not found");
    }

    const booking = bookingRes.rows[0];

    //? for Customer
    if (role === "customer") {
      if (booking.customer_id !== userId) {
        throw new Error("You are not authorized to manage this booking");
      }

      if (newStatus !== "cancelled") {
        throw new Error("Invalid status update for customer");
      }

      //! check if cancellation is allowed (before start date)
      const currentDate = new Date();
      const startDate = new Date(booking.rent_start_date);

      if (currentDate >= startDate) {
        throw new Error("Cannot cancel booking after it has started");
      }

      //? update booking status
      const updateRes = await client.query(
        `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
        [bookingId]
      );

      //? update vehicle status to available
      await client.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      );

      await client.query("COMMIT");
      return updateRes.rows[0];
    }
    //? for Admin
    else if (role === "admin") {
      if (newStatus !== "returned") {
        throw new Error("Invalid status update for admin");
      }

      // update booking status
      const updateRes = await client.query(
        `UPDATE bookings SET status = 'returned' WHERE id = $1 RETURNING *`,
        [bookingId]
      );

      //? update vehicle status to available
      await client.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      );

      await client.query("COMMIT");

      const updatedBooking = updateRes.rows[0];

      //? return data
      return {
        ...updatedBooking,
        vehicle: {
          availability_status: "available",
        },
      };
    } else {
      throw new Error("Invalid role");
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const bookingService = {
  createBooking,
  getBooking,
  updateBooking,
};
