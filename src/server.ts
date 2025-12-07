import app from "./app";
import { ENV } from "./config/dotenv.config";


const PORT = ENV.port;

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}/`);
});
