import { config } from 'dotenv';

config();

const env = {
  legendasTv: {
    username: process.env.LEGENDAS_TV_USERNAME,
    password: process.env.LEGENDAS_TV_PASSWORD,
  },
};

export default env;

export type Config = Partial<typeof env>;
