export function uniq<T>(values: T[]): T[] { return [...new Set(values)]; }
export function pushMapArray<T>(map: Map<string,T[]>, key: string, value: T): void {
  const list = map.get(key) ?? [];
  if (!list.includes(value)) list.push(value);
  map.set(key, list);
}
export async function runPool<T>(items: T[], concurrency: number, worker: (item: T) => Promise<void>): Promise<void> {
  const width = Math.max(1, Math.min(concurrency, items.length || 1));
  let next = 0;
  const runners = Array.from({length: width}, async () => {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      await worker(items[index]);
    }
  });
  await Promise.all(runners);
}
