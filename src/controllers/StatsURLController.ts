import { inject, Lifecycle, registry, scoped } from "tsyringe";
import Controller, { CustomRequest, CustomRequestHandler, CustomResponse } from "./Controller";
import { Command } from "../commands/Command";
import { StatsURLCommandParameters, StatsURLCommandReturn } from "../commands/StatsURLCommand";

interface StatsURLParams {
  id: string;
}

interface StatsURLResponse {
  originalUrl?: string;
  createdAt?: Date;
  expiresAt?: Date | null;
  clicks?: number;
  lastAccessedAt?: Date | null;
  message?: string;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: StatsURLController }])
class StatsURLController extends Controller<StatsURLParams, undefined, undefined, StatsURLResponse> {
  public readonly middlewares: CustomRequestHandler[] = [];

  constructor(
    @inject('StatsURLCommand') private readonly command: Command<StatsURLCommandParameters, StatsURLCommandReturn>
  ) {
    super('get', '/stats/:id');
  }

  async handleRequest(req: CustomRequest<StatsURLParams, undefined, undefined>, res: CustomResponse<StatsURLResponse>): Promise<void> {
    const urlId = req.params.id;

    const result = await this.command.execute({ urlId });

    if (!result) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.status(200).json(result);
  }
}

export default StatsURLController;
