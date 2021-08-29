import { config } from 'dotenv';

config();

const env = {
  legendasTv: {
    username: process.env.LEGENDASTV_USERNAME,
    password: process.env.LEGENDASTV_PASSWORD,
  },
};

export default env;

export type Config = Partial<typeof env>;
