import 'dotenv/config';

const requiredEnvVar = (environmentVariable: any, variableName: string): any=> {
  if (environmentVariable === undefined) {
    throw new Error(`Missing environment variable: ${variableName}`);
  }

  return environmentVariable;
}

const ENVIRONMENT = {
  SERVER: {
    PORT: process.env.PORT || 3000,
    BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  },
  CAPACITY: {
    AMOUNT_OF_REQUEST_PER_MONTH: requiredEnvVar(process.env.AMOUNT_OF_REQUEST_PER_MONTH, 'AMOUNT_OF_REQUEST_PER_MONTH'),
  },
  CRYPTOGRAPHY: {
    SECRET: requiredEnvVar(process.env.CRYPTOGRAPHY_SECRET, 'CRYPTOGRAPHY_SECRET'),
    IV: requiredEnvVar(process.env.CRYPTOGRAPHY_IV, 'CRYPTOGRAPHY_IV'),
  },
  URL: {
    TTL_HOURS: process.env.URL_TTL_HOURS ? parseInt(process.env.URL_TTL_HOURS, 10) : null,
  },
};

export default ENVIRONMENT;
