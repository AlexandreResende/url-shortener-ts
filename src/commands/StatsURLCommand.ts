import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { URLRecord } from "../localDB";
import { Command } from "./Command";
import URLRepository from "../repositories/Redis/URLRepository";

export interface StatsURLCommandParameters {
  urlId: string;
}

export type StatsURLCommandReturn = Omit<URLRecord, 'hash'> | undefined;

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'StatsURLCommand', useClass: StatsURLCommand }])
class StatsURLCommand implements Command<StatsURLCommandParameters, StatsURLCommandReturn> {
  constructor(
    @inject('URLRepository') private readonly repository: URLRepository,
  ) {}

  async execute(parameters: StatsURLCommandParameters): Promise<StatsURLCommandReturn> {
    const record = await this.repository.findByHash(parameters.urlId);

    if (!record) {
      return undefined;
    }

    if (record.expiresAt && new Date() > record.expiresAt) {
      await this.repository.delete(parameters.urlId);
      return undefined;
    }

    const { hash: _, ...stats } = record;
    return stats;
  }
}

export default StatsURLCommand;
