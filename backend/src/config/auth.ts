import "dotenv/config";

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

if (!accessTokenSecret) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

if (!refreshTokenSecret) {
  throw new Error("JWT_REFRESH_SECRET is not defined");
}

export const authConfig = {
  accessTokenSecret,
  refreshTokenSecret,

  accessTokenExpiresIn: "15m" as const,
  refreshTokenExpiresIn: "7d" as const,
};