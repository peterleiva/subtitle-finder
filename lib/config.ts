import { config } from 'dotenv';

config();

const env = {
  legendasTv: {
    username: process.env.LEGENDAS_TV_USERNAME,
    password: process.env.LEGENDAS_TV_PASSWORD,
  },
  openSubtitle: {
    username: process.env.OPENSUBTITLE_USERNAME,
    password: process.env.OPENSUBTITLE_PASSWORD_MD5,
  },
};

export default env;

export type Config = Partial<typeof env>;
