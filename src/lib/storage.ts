export const CATALOG_KEY = "order:catalog";
export const orderKey = (date: string) => `order:day:${date}`;

export const appStorage = {
  async get(key: string): Promise<{ value: string | null } | null> {
    try {
      if (typeof window !== 'undefined' && (window as any).storage && typeof (window as any).storage.get === 'function') {
        const res = await (window as any).storage.get(key, false);
        if (res && res.value !== undefined) {
          return res;
        }
      }
    } catch (e) {
      // fallback
    }
    try {
      const val = localStorage.getItem(key);
      return val !== null ? { value: val } : null;
    } catch (e) {
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && (window as any).storage && typeof (window as any).storage.set === 'function') {
        await (window as any).storage.set(key, value, false);
        return;
      }
    } catch (e) {
      // fallback
    }
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }
};
