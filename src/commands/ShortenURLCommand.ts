import { inject, Lifecycle, registry, scoped } from "tsyringe";

import db from "../localDB";
import { Command } from "./Command";
import ENVIRONMENT from "../Environment";
import HashService from "../services/HashService";

const MAX_COLLISION_RETRIES = 5;

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
    const originalUrl = parameters.url;

    const existing = db.findByUrl(originalUrl);
    if (existing && !this.isExpired(existing.expiresAt)) {
      return { url: `${ENVIRONMENT.SERVER.BASE_URL}/${existing.hash}` };
    }

    let hashedURL = this.hashService.hash(originalUrl);
    let retries = 0;

    while (db.has(hashedURL)) {
      retries++;
      if (retries > MAX_COLLISION_RETRIES) {
        throw new Error('Max collision retries exceeded. Hash space may be saturated.');
      }
      hashedURL = this.hashService.hash(hashedURL);
    }

    const now = new Date();
    const ttlHours = ENVIRONMENT.URL.TTL_HOURS;

    db.set(hashedURL, {
      originalUrl,
      hash: hashedURL,
      createdAt: now,
      expiresAt: ttlHours ? new Date(now.getTime() + ttlHours * 60 * 60 * 1000) : null,
      clicks: 0,
      lastAccessedAt: null,
    });

    return { url: `${ENVIRONMENT.SERVER.BASE_URL}/${hashedURL}` };
  }

  private isExpired(expiresAt: Date | null): boolean {
    if (!expiresAt) return false;
    return new Date() > expiresAt;
  }
}

export default ShortenURLCommand;
