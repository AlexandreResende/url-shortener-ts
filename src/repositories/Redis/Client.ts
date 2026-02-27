import { BasicClientSideCache, createClient, RedisClientType } from "redis";
import { Lifecycle, registry, scoped } from "tsyringe";
import ENVIRONMENT from "../../Environment";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'RedisClient', useClass: RedisClient }])
class RedisClient {
  private client: RedisClientType | null = null;

  public getClient(): RedisClientType {
    if (!this.client) {
      const cache = new BasicClientSideCache({
        ttl: ENVIRONMENT.REDIS.CACHE_TTL,
      });
      this.client = createClient({
        url: ENVIRONMENT.REDIS.URL,
        RESP: 3,
        clientSideCache: cache,
      }) as unknown as RedisClientType;

      this.client.on("error", (error) => {
        console.error(error);
      });

      this.client.connect().catch((err) => {
        console.error('Redis connection failed:', err.message);
      });
    }

    return this.client;
  }
}

export default RedisClient;
