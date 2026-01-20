import { redisClient } from "../config/redis";

export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redisClient.get(key);
  if (!data) return null;
  return JSON.parse(data) as T;
};

export const setCache = async (
  key: string,
  value: any,
  ttlSeconds: number
) => {
  await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
};

export const deleteCache = async (key: string) => {
  await redisClient.del(key);
};
