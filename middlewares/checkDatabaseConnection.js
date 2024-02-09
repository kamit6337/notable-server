import { isDatabaseConnected } from "../server.js";
import HandleGlobalError from "../utils/HandleGlobalError.js";

const checkDatabaseConnection = (req, res, next) => {
  if (!isDatabaseConnected) {
    return next(new HandleGlobalError("Server is not connected", 500));
  }
  next();
};

export default checkDatabaseConnection;
