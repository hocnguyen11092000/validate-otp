import { Injectable, inject } from '@angular/core';
import { SESSION_STORAGE } from 'src/shared/di/session-storage';

@Injectable({ providedIn: 'root' })
export class SessionStorage {
  private readonly ss = inject(SESSION_STORAGE);

  getItem<TData = string>(
    key: string
  ): (TData extends object ? TData : string) | null {
    if (!this.ss) {
      return null;
    }

    const item = this.ss.getItem(key);

    if (!item) {
      return null;
    }

    try {
      const parsed = JSON.parse(item);
      if (typeof parsed === 'object') {
        return parsed;
      }

      return item as TData extends object ? TData : string;
    } catch (e) {
      return item as TData extends object ? TData : string;
    }
  }

  setItem(key: string, data: unknown): void {
    if (!this.ss) return;

    if (typeof data === 'object') {
      this.ss.setItem(key, JSON.stringify(data));
    } else {
      this.ss.setItem(key, data as string);
    }
  }

  removeItem(key: string) {
    if (this.ss) {
      this.ss.removeItem(key);
    }
  }
}
