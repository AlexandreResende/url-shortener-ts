import { inject, Lifecycle, registry, scoped } from "tsyringe";

import db from "../localDB";

import { Command } from "./Command";
import URLRepository from "../repositories/Redis/URLRepository";

export interface RedirectURLCommandParameters {
  urlId: string;
}

export interface RedirectURLCommandReturn {
  url?: string;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'RedirectURLCommand', useClass: RedirectURLCommand }])
class RedirectURLCommand implements Command<RedirectURLCommandParameters, RedirectURLCommandReturn> {
  constructor(
    @inject('URLRepository') private readonly repository: URLRepository,
  ) {}

  async execute(parameters: RedirectURLCommandParameters): Promise<RedirectURLCommandReturn> {
    console.log(`Inside redirect url command with parameters: ${parameters.urlId}`);
    const originalURL = await this.repository.getKey(parameters.urlId);

    if (!originalURL) {
      console.log('Original URL does not exist');
      return { url: undefined };
    }

    console.log('Finished redirect url command process');

    return { url: originalURL };
  }
}

export default RedirectURLCommand;
