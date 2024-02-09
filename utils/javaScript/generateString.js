import { environment } from "../environment.js";
import crypto from "crypto";

const generateString = (length = 25) => {
  // const characters = environment.STRING_CHARACTERS;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!!@$^*&+-/*|<>/?";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

export default generateString;
