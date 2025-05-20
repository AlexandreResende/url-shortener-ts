import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { container, injectable, injectAll, Lifecycle, scoped } from "tsyringe";
import Controller from "../controllers/Controller";
import { expressHandler } from "../middlewares/ExpressHandler";

export type HttpVerb = 'get' | 'put' | 'post' | 'patch' | 'delete';

@scoped(Lifecycle.ResolutionScoped)
@injectable()
class CustomRouter {
  public readonly router: Router;

  constructor(
    @injectAll('Controller') private readonly controllers: Controller<unknown, unknown, unknown, unknown>[]
  ) {
    this.router = Router();

    this.controllers.forEach((controller) => {
      this.router[controller.method](controller.path, this.getHandlers(controller));
    });
  }

  private getHandlers(controller: Controller<unknown, unknown, unknown, unknown>): RequestHandler[] {
    const handler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        await expressHandler(controller)(req, res, next);
      } catch (error) {
        next(error);
      }
    }

    return [ handler ];
  }
}

export default container.resolve(CustomRouter).router;
