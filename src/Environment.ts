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
    BASE_URL: `localhost:${process.env.PORT}`,
  },
  CAPACITY: {
    AMOUNT_OF_REQUEST_PER_MONTH:requiredEnvVar(process.env.AMOUNT_OF_REQUEST_PER_MONTH, 'AMOUNT_OF_REQUEST_PER_MONTH'),
  },
  CRYPTOGRAPHY: {
    SECRET: requiredEnvVar(process.env.CRYPTOGRAPHY_SECRET, 'CRYPTOGRAPHY_SECRET'),
    IV: requiredEnvVar(process.env.CRYPTOGRAPHY_IV, 'CRYPTOGRAPHY_IV')
  }
};

export default ENVIRONMENT;
