import { environment } from "./environment.js";

export const corsOptions = {
  origin: ["https://www.notable-client.onrender.com"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
