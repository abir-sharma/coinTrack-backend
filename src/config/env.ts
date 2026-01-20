export const env = {
  JWT_SECRET: process.env.JWT_SECRET,
};

if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET missing");
}
