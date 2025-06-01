import { BasicClientSideCache, createClient } from "redis";
import { Lifecycle, registry, scoped } from "tsyringe";
import ENVIRONMENT from "../../Environment";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'RedisClient', useClass: RedisClient }])
class RedisClient {
  public getClient() {
    const cache = new BasicClientSideCache({
      ttl: ENVIRONMENT.CACHE.TTL, // 0 means no expiration - 259200000 = 3 days
    });
    const client = createClient({
      url: 'redis://172.18.0.2:6379',
      RESP: 3,
      clientSideCache: cache,
    });
    client.on("error", (error) => {
      console.error(error);
    });

    (async () => {
      await client.connect();
    })()

    return client;
  }
}

export default RedisClient;
