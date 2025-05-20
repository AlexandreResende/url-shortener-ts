import { Lifecycle, registry, scoped } from "tsyringe";

import Controller, { CustomRequest, CustomRequestHandler, CustomResponse } from "./Controller";

interface HealthCheckResponse {
  message: string;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: HealthCheckController }])
class HealthCheckController extends Controller<undefined, undefined, undefined, HealthCheckResponse> {
  public readonly middlewares: CustomRequestHandler[] = [];

  constructor() {
    super('get', '/healthz');
  }

  async handleRequest(
    _: CustomRequest<undefined, undefined, undefined>,
    res: CustomResponse<HealthCheckResponse>): Promise<void> {
      res.status(200).json({ message: 'Application healthy' });

      return;
  }
}

export default HealthCheckController;
