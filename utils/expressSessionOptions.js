import MongoStore from "connect-mongo";
import { environment } from "./environment.js";

const expressSessionOptions = {
  cookie: { httpOnly: true, maxAge: environment.JWT_EXPIRES_IN },
  secret: environment.JWT_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  name: "OAuth-session",
  store: MongoStore.create({
    mongoUrl: environment.MONGO_DB_URI,
    ttl: 14 * 24 * 60 * 60, // 14 days expiration
  }),
};

export default expressSessionOptions;
