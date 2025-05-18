import { NextFunction, Request, Response } from "express"

import Controller from "../controllers/Controller";

export const expressHandler = (controller: Controller<unknown, unknown, unknown, unknown>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller.handleRequest(req, res);
    } catch(error: any) {
      next(error);
    }
  }
}