// Environment variables
import dotenv from "dotenv";

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
}

export const config: Config = new Config();
