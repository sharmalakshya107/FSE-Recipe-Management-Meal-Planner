import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { config } from "./index.js";
import { authRepository, UserRecord } from "../modules/auth/auth.repository.js";
import { v4 as uuidv4 } from "uuid";

if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: `${config.CALLBACK_URL_PREFIX}/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email)
            return done(new Error("No email found from Google profile"), false);

          let user = await authRepository.findByEmail(email);

          if (user) {
            user.googleId = profile.id;
            await authRepository.save(user);
            return done(null, user);
          }

          const newUser: UserRecord = {
            id: uuidv4(),
            email,
            firstName:
              profile.name?.givenName ||
              profile.displayName.split(" ")[0] ||
              "",
            lastName:
              profile.name?.familyName ||
              profile.displayName.split(" ").slice(1).join(" ") ||
              "",
            role: "user",
            createdAt: new Date().toISOString(),
            passwordHash: "",
            tokenVersion: 0,
            refreshTokens: new Set(),
            failedLoginAttempts: 0,
            emailVerified: true,
            googleId: profile.id,
          };

          await authRepository.save(newUser);
          done(null, newUser);
        } catch (error) {
          done(error as Error, false);
        }
      },
    ),
  );
}

if (config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: `${config.CALLBACK_URL_PREFIX}/github/callback`,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: import("passport-github2").Profile,
        done: (err: Error | null, user?: UserRecord | false) => void,
      ) => {
        try {
          const email =
            profile.emails?.[0]?.value || `${profile.username}@github.com`;

          let user = await authRepository.findByEmail(email);

          if (user) {
            user.githubId = profile.id;
            await authRepository.save(user);
            return done(null, user);
          }

          const displayName = profile.displayName || profile.username || "";
          const [firstName, ...lastNameParts] = displayName.split(" ");

          const newUser: UserRecord = {
            id: uuidv4(),
            email,
            firstName: firstName || "",
            lastName: lastNameParts.join(" ") || "",
            role: "user",
            createdAt: new Date().toISOString(),
            passwordHash: "",
            tokenVersion: 0,
            refreshTokens: new Set(),
            failedLoginAttempts: 0,
            emailVerified: true,
            githubId: profile.id,
          };

          await authRepository.save(newUser);
          done(null, newUser);
        } catch (error) {
          done(error as Error, false);
        }
      },
    ),
  );
}

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as UserRecord).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await authRepository.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
