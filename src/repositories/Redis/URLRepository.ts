import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { URLRecord } from "../../localDB";
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

  public async save(hash: string, record: URLRecord): Promise<void> {
    await this.client.set(`hash:${hash}`, JSON.stringify(record));
    await this.client.set(`url:${record.originalUrl}`, hash);

    if (record.expiresAt) {
      const ttlSeconds = Math.floor((record.expiresAt.getTime() - Date.now()) / 1000);
      if (ttlSeconds > 0) {
        await this.client.expire(`hash:${hash}`, ttlSeconds);
        await this.client.expire(`url:${record.originalUrl}`, ttlSeconds);
      }
    }
  }

  public async findByHash(hash: string): Promise<URLRecord | null> {
    const data = await this.client.get(`hash:${hash}`);
    if (!data) return null;
    return this.deserialize(data);
  }

  public async findByUrl(url: string): Promise<URLRecord | null> {
    const hash = await this.client.get(`url:${url}`);
    if (!hash) return null;
    return this.findByHash(hash);
  }

  public async exists(hash: string): Promise<boolean> {
    const result = await this.client.exists(`hash:${hash}`);
    return result > 0;
  }

  public async update(hash: string, record: URLRecord): Promise<void> {
    await this.client.set(`hash:${hash}`, JSON.stringify(record));
  }

  public async delete(hash: string): Promise<void> {
    const record = await this.findByHash(hash);
    if (record) {
      await this.client.del(`url:${record.originalUrl}`);
    }
    await this.client.del(`hash:${hash}`);
  }

  private deserialize(data: string): URLRecord {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      lastAccessedAt: parsed.lastAccessedAt ? new Date(parsed.lastAccessedAt) : null,
    };
  }
}

export default URLRepository;
