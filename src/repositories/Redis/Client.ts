import { create } from "domain";
import { createClient } from "redis";
import { Lifecycle, registry, scoped } from "tsyringe";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'RedisClient', useClass: RedisClient }])
class RedisClient {
  public getClient() {
    const client = createClient({
      url: 'redis://172.18.0.2:6379'
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
