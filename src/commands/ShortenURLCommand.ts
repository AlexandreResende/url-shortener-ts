import { inject, Lifecycle, registry, scoped } from "tsyringe";

import { Command } from "./Command";
import ENVIRONMENT from "../Environment";
import HashService from "../services/HashService";
import URLRepository from "../repositories/Redis/URLRepository";

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
    @inject('URLRepository') private readonly repository: URLRepository,
  ) {}

  async execute(parameters: ShortenURLCommandParameters): Promise<ShortenURLCommandReturn> {
    console.log(`Inside shorten url command with parameters: ${parameters.url}`);
    const oldURL = parameters.url;
    let hashedURL = this.hashService.hash(oldURL);
    
    while (await this.repository.getKey(hashedURL)) {
      hashedURL = this.hashService.hash(hashedURL);
    }
    const fullURL = `${ENVIRONMENT.SERVER.BASE_URL}/${hashedURL}`
    
    await this.repository.setKey(hashedURL, oldURL);

    console.log('FInished shorten url operation');

    return { url: fullURL };
  }
}

export default ShortenURLCommand;
