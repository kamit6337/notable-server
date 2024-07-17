import dotenv from "dotenv";
dotenv.config();
import { environment } from "./utils/environment.js";
import app from "./app.js";
import connectToDB from "./utils/connectToDB.js";

const PORT = environment.PORT || 8080;

console.log("Connecting to MongoDB...");

(async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectToDB();

    app.listen(PORT, () => {
      console.log(`Server is connected on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    // Return an error response to the frontend if the connection fails
    app.use((req, res) => {
      res.status(500).json({
        message: "Failed to connect to the database. Please try again later.",
        error: error.message,
      });
    });
  }
})();

// Export the app instance for Vercel
export default app;
