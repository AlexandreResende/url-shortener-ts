import 'reflect-metadata';
import './di'
import express from "express";
import { rateLimit } from "express-rate-limit";

import ENVIRONMENT from "./Environment";
import Routers from "./routers/Routers";

const limiter = rateLimit({
  limit: 5,
  windowMs: 1000 * 60 * 1,
  message: "Too many requests, please try again later."
});

const app = express();

app.use(express.json());
app.use(limiter);

app.use(Routers);

app.listen(ENVIRONMENT.SERVER.PORT, () => {
  console.log(`Server running on port: ${ENVIRONMENT.SERVER.PORT}`);
});

export default app;
