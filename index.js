import dotenv from "dotenv";
dotenv.config();
import { environment } from "./utils/environment.js";
import app from "./app.js";
import connectToDB from "./utils/connectToDB.js";

const PORT = environment.PORT || 8080;

console.log("Connecting to MongoDB...");
connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
  });
});
