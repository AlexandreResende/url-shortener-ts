import { Lifecycle, registry, scoped } from "tsyringe";
import db, { URLRecord } from "../localDB";
import { Command } from "./Command";

export interface StatsURLCommandParameters {
  urlId: string;
}

export type StatsURLCommandReturn = Omit<URLRecord, 'hash'> | undefined;

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'StatsURLCommand', useClass: StatsURLCommand }])
class StatsURLCommand implements Command<StatsURLCommandParameters, StatsURLCommandReturn> {
  constructor() {}

  async execute(parameters: StatsURLCommandParameters): Promise<StatsURLCommandReturn> {
    const record = db.get(parameters.urlId);

    if (!record) {
      return undefined;
    }

    if (record.expiresAt && new Date() > record.expiresAt) {
      db.delete(parameters.urlId);
      return undefined;
    }

    const { hash: _, ...stats } = record;
    return stats;
  }
}

export default StatsURLCommand;
