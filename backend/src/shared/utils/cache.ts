type CacheEntry<T> = {
  data: T;
  expiry: number;
};

export class SimpleCache<T> {
  private cache = new Map<string, CacheEntry<T>>();

  constructor(private ttlMs: number = 60000) {}

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttlMs,
    });
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
