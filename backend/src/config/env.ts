
import { cleanEnv, str, port } from 'envalid';

const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  ALPHA_VANTAGE_API_KEY: str(),
  REDIS_URL: str(),
  PORT: port({ default: 4000 }),
  LOG_LEVEL: str({ default: 'info' }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
});

export default env;
