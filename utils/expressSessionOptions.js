import { environment } from "./environment.js";

const expressSessionOptions = {
  cookie: { httpOnly: true, maxAge: environment.JWT_EXPIRES_IN },
  secret: environment.JWT_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  name: "OAuth-session",
};

export default expressSessionOptions;
