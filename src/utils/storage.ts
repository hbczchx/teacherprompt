const STORAGE_PREFIX = 'teacherprompt:';

export function getItem<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(STORAGE_PREFIX + key);
  if (!raw) return fallback;
  return JSON.parse(raw) as T;
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key);
}
