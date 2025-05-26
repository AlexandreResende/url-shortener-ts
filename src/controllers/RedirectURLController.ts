import { inject, Lifecycle, registry, scoped } from "tsyringe";
import Controller, { CustomRequest, CustomRequestHandler, CustomResponse } from "./Controller";
import RedirectURLCommand from "../commands/RedirectURLCommand";

export interface RedirectURLParams {
  id: string;
}

export interface RedirectURLResponse {
  url?: string;
  message?: string;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: RedirectURLController }])
class RedirectURLController extends Controller<RedirectURLParams, undefined, undefined, RedirectURLResponse> {
  public readonly middlewares: CustomRequestHandler[] = [];

  constructor(
    @inject('RedirectURLCommand') private readonly command: RedirectURLCommand
  ) {
    super('get', '/:id');
  }

  async handleRequest(req: CustomRequest<RedirectURLParams, undefined, undefined>, res: CustomResponse<RedirectURLResponse>): Promise<void> {
    const urlId = req.params.id;

    const result = await this.command.execute({ urlId });

    if (result.url === undefined) {
      res.status(404).json({ message: 'Not found' });

      return;
    }

    res.redirect(301, result.url);

    return;
  }
}

export default RedirectURLController;
