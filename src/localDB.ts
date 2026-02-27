export interface URLRecord {
  originalUrl: string;
  hash: string;
  createdAt: Date;
  expiresAt: Date | null;
  clicks: number;
  lastAccessedAt: Date | null;
}

const hashToRecord = new Map<string, URLRecord>();
const urlToHash = new Map<string, string>();

const db = {
  get(hash: string): URLRecord | undefined {
    return hashToRecord.get(hash);
  },

  set(hash: string, record: URLRecord): void {
    hashToRecord.set(hash, record);
    urlToHash.set(record.originalUrl, hash);
  },

  has(hash: string): boolean {
    return hashToRecord.has(hash);
  },

  delete(hash: string): void {
    const record = hashToRecord.get(hash);
    if (record) {
      urlToHash.delete(record.originalUrl);
    }
    hashToRecord.delete(hash);
  },

  findByUrl(url: string): URLRecord | undefined {
    const hash = urlToHash.get(url);
    if (!hash) return undefined;
    return hashToRecord.get(hash);
  },
};

export default db;
