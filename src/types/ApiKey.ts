export interface IApiKey {
  key: string;
  name: string;               // Partner name
  permissions: string[];     // Scopes
  isActive: boolean;
  rateLimit: number;         // requests per minute
  lastUsedAt?: Date;
  createdAt: Date;
}