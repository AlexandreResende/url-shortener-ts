import 'reflect-metadata';
import './di'
import express from "express";

import ENVIRONMENT from "./Environment";
import Routers from "./routers/Routers";

const app = express();

app.use(express.json());

app.use(Routers);

app.listen(ENVIRONMENT.SERVER.PORT, () => {
  console.log(`Server running on port: ${ENVIRONMENT.SERVER.PORT}`);
});

export default app;
