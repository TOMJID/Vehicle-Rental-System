import app from "./app";
import { ENV } from "./config/dotenv.config";

import { bookingService } from "./modules/booking/booking.service";

const PORT = ENV.port;

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}/`);
  
  //! auto-return expired bookings every minute
  setInterval(() => {
    bookingService.returnExpiredBookings();
  }, 60000);
});
