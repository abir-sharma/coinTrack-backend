import "dotenv/config";      // MUST be first
import app from "./app";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";


// DB connection
connectDB();

(async () => {
  await connectRedis();
})();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
