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
  },
  CAPACITY: {
    AMOUNT_OF_REQUEST_PER_MONTH:requiredEnvVar(process.env.AMOUNT_OF_REQUEST_PER_MONTH, 'AMOUNT_OF_REQUEST_PER_MONTH'),
  }
};

export default ENVIRONMENT;
