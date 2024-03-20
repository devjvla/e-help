import dotenv from "dotenv";
dotenv.config();

const constants = {
  PORT: 3000,
  DB_CONFIG: {
    host: "127.0.0.1",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
  },
  JWT_TOKEN_EXPIRATION: 1_800_000
}

export default constants;