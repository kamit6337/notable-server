import { environment } from "./environment.js";

export const corsOptions = {
  origin: [
    environment.CLIENT_URL,
    "https://notable-client.onrender.com",
    "notable-client.onrender.com",
    "http://notable-client.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
