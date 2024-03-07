import { environment } from "./environment.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

// NOTE:GOOGLE OAUTH
passport.use(
  new GoogleStrategy(
    {
      clientID: environment.GOOGLE_CLIENT_ID,
      clientSecret: environment.GOOGLE_CLIENT_SECRET,
      callbackURL: `/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
