import { inject, Lifecycle, registry, scoped } from "tsyringe";

import RedisClient from "./Client";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'URLRepository', useClass: URLRepository }])
class URLRepository {
  private readonly client;

  constructor(
    @inject('RedisClient') private readonly redisClient: RedisClient,
  ) {
    this.client = redisClient.getClient();
  }

  public async setKey(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  public async getKey(key: string): Promise<string | null> {
    const result = await this.client.get(key);

    return result;
  }
}

export default URLRepository;
