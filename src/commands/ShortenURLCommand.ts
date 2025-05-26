import { inject, Lifecycle, registry, scoped } from "tsyringe";

import db from "../localDB";
import { Command } from "./Command";
import ENVIRONMENT from "../Environment";
import HashService from "../services/HashService";

export interface ShortenURLCommandParameters {
  url: string;
}

export interface ShortenURLCommandReturn {
  url: string;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'ShortenURLCommand', useClass: ShortenURLCommand }])
class ShortenURLCommand implements Command<ShortenURLCommandParameters, ShortenURLCommandReturn> {
  constructor(
    @inject('HashService') private readonly hashService: HashService,
  ) {}

  async execute(parameters: ShortenURLCommandParameters): Promise<ShortenURLCommandReturn> {
    const oldURL = parameters.url;
    let hashedURL = this.hashService.hash(oldURL);
    const fullURL = `${ENVIRONMENT.SERVER.BASE_URL}/${hashedURL}`

    while (db.get(hashedURL)) {
      hashedURL = this.hashService.hash(hashedURL);
    }

    db.set(hashedURL, parameters.url);

    return { url: fullURL };
  }
}

export default ShortenURLCommand;
