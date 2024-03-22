import { environment } from "./environment.js";

export const corsOptions = {
  origin: [environment.CLIENT_URL],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
