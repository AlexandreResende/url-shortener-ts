import { inject, Lifecycle, registry, scoped } from "tsyringe";

import { Command } from "../commands/Command";
import Controller, { CustomRequest, CustomRequestHandler, CustomResponse } from "./Controller";
import { ShortenURLCommandParameters, ShortenURLCommandReturn } from "../commands/ShortenURLCommand";
import Joi, { ValidationError, ValidationErrorItem } from "joi";

interface ShortenURLRequest {
  url: string;
}

interface ShortenURLResponse {
  url?: string;
  error?: string[];
}

const shortenURLSchema = Joi.object({
  url: Joi.string().uri().required(),
});

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: ShortenURLController }])
class ShortenURLController extends Controller<unknown, ShortenURLRequest, unknown, ShortenURLResponse> {
  public readonly middlewares: CustomRequestHandler[] = [];

  constructor(
    @inject('ShortenURLCommand') private readonly command: Command<ShortenURLCommandParameters, ShortenURLCommandReturn>
  ) {
    super('post', '/shorten');
  }

  async handleRequest(req: CustomRequest<unknown, ShortenURLRequest, unknown>, res: CustomResponse<ShortenURLResponse>): Promise<void> {
    const validationResult = shortenURLSchema.validate(req.body);

    if (validationResult.error?.details) {
      const errorMessages: string[] = [];

      validationResult.error.details.forEach(error => {
        errorMessages.push(error.message);
      });

      res
        .status(400)
        .json({ error: errorMessages });

      return;
    }

    const result = await this.command.execute(req.body);

    res.status(200).json({ url: result.url });

    return;
  }
}

export default ShortenURLController;
