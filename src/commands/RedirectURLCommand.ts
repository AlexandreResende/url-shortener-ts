import { Lifecycle, registry, scoped } from "tsyringe";
import db from "../localDB";
import { Command } from "./Command";

export interface RedirectURLCommandParameters {
  urlId: string;
}

export interface RedirectURLCommandReturn {
  url?: string;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'RedirectURLCommand', useClass: RedirectURLCommand }])
class RedirectURLCommand implements Command<RedirectURLCommandParameters, RedirectURLCommandReturn> {
  constructor() {}

  async execute(parameters: RedirectURLCommandParameters): Promise<RedirectURLCommandReturn> {
    const url = db.get(parameters.urlId);

    if (!url) {
      return { url: undefined };
    }

    return { url };
  }
}

export default RedirectURLCommand;
