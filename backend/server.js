import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";

const startServer = async () => {
  try {
    await connectDb(env.mongoUri);

    app.listen(env.port, () => {
      console.log(`Server running at ${env.appBaseUrl}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
