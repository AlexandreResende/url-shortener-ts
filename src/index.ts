import express, { Request, Response } from "express";

import ENVIRONMENT from "./Environment";

const app = express();

app.use(express.json());

app.listen(ENVIRONMENT.SERVER.PORT, () => {
  console.log(`Server running on port: ${ENVIRONMENT.SERVER.PORT}`);
});
