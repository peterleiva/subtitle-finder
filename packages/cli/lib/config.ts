import { config } from 'dotenv';
import createDebugger from 'debug';

const debug = createDebugger('cli:env');

config();

const env = {
  credentials: {
    legendastv: {
      username: process.env.LEGENDAS_TV_USERNAME,
      password: process.env.LEGENDAS_TV_PASSWORD,
    },
    opensubtitles: {
      username: process.env.OPENSUBTITLE_USERNAME,
      password: process.env.OPENSUBTITLE_PASSWORD_MD5,
    },
  },
  headless: !['0', 'false'].some(env => env === process.env.HEADLESS),
};

for (const [provider, credentials] of Object.entries(env.credentials)) {
  if (!Object.values(credentials).every(Boolean))
    debug(
      'wrong credentials for %s. Please set environment variable correctly',
      provider
    );
}

export type Config = Partial<typeof env>;
export default env;
