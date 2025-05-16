import express from "express";

import ENVIRONMENT from "./Environment";
import healthCheckRouter from "./routers/HealthCheckRouter";

const app = express();

app.use(express.json());

app.use('', healthCheckRouter);

app.listen(ENVIRONMENT.SERVER.PORT, () => {
  console.log(`Server running on port: ${ENVIRONMENT.SERVER.PORT}`);
});

export default app;
