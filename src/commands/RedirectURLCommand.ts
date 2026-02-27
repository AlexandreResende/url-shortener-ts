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
    const record = db.get(parameters.urlId);

    if (!record) {
      return { url: undefined };
    }

    if (record.expiresAt && new Date() > record.expiresAt) {
      db.delete(parameters.urlId);
      return { url: undefined };
    }

    record.clicks++;
    record.lastAccessedAt = new Date();

    return { url: record.originalUrl };
  }
}

export default RedirectURLCommand;
