import { inject, Lifecycle, registry, scoped } from "tsyringe";

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
    const record = await this.repository.findByHash(parameters.urlId);

    if (!record) {
      return { url: undefined };
    }

    if (record.expiresAt && new Date() > record.expiresAt) {
      await this.repository.delete(parameters.urlId);
      return { url: undefined };
    }

    record.clicks++;
    record.lastAccessedAt = new Date();
    await this.repository.update(parameters.urlId, record);

    return { url: record.originalUrl };
  }
}

export default RedirectURLCommand;
