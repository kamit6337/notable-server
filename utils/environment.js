import dotenv from "dotenv";
dotenv.config();

export const environment = {
  PORT: process.env.PORT,
  mongoDB_url: process.env.mongoDB_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  CLIENT_CHECKLOGIN_URL: `${process.env.CLIENT_URL}/login/check`,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  SERVER_URL: `http://localhost:${process.env.PORT}`,
  FACEBOOK_APP_ID: process.env.FACEBOOK_OAUTH_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_OAUTH_APP_SECRET,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN),
  MY_GMAIL_PASSWORD: process.env.MY_GMAIL_PASSWORD,
  MY_GMAIL_ID: process.env.MY_GMAIL_ID,
  STRING_CHARACTERS: process.env.STRING_CHARACTERS,
};
