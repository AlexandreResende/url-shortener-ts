export interface URLRecord {
  originalUrl: string;
  hash: string;
  createdAt: Date;
  expiresAt: Date | null;
  clicks: number;
  lastAccessedAt: Date | null;
}
