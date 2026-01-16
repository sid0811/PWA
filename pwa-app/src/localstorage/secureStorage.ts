import { writeErrorLog } from '../utility/utils';

// PWA: Using localStorage as replacement for AsyncStorage
class Storage {
  private _storage = localStorage;
  constructor() {
    this._storage = localStorage;
  }

  public set<T>(key: string, value: T): void {
    try {
      if (typeof value === 'string') {
        localStorage.setItem(key.toString(), value);
      } else if (typeof value === 'number' && !isNaN(value)) {
        localStorage.setItem(key.toString(), `${value}`);
      } else if (typeof value === 'boolean') {
        localStorage.setItem(key.toString(), `${value}`);
      } else if (typeof value === 'object') {
        localStorage.setItem(key.toString(), JSON.stringify(value));
      } else {
        throw new Error(
          'The value must be a type string, number, object or boolean. For objects please use JSON.stringify',
        );
      }
    } catch (error) {
      writeErrorLog('Storage', error);
      console.log('Error', error);
    }
  }

  public async getBoolean(key: string): Promise<boolean | undefined> {
    try {
      const value = localStorage.getItem(key);
      if (!value) return false;
      return Boolean(value);
    } catch (error) {
      writeErrorLog('Storage', error);
      return undefined;
    }
  }
  public async getString(key: string): Promise<string | undefined> {
    try {
      const value = localStorage.getItem(key.toString());
      if (value === null) return;
      return value;
    } catch (error) {
      writeErrorLog('Storage', error);
      //console.log("getString error:", error);
      return undefined;
    }
  }

  public async getNumber(key: string): Promise<number | undefined> {
    try {
      const value = localStorage.getItem(key.toString());
      if (!value) return 0;
      return parseInt(value);
    } catch (error) {
      writeErrorLog('Storage', error);
      //console.log("getNumber error:", error);
      return undefined;
    }
  }
  public async getObject(key: string): Promise<any> {
    try {
      const value = localStorage.getItem(key.toString());
      if (!value) {
        return undefined;
      }
      return value;
    } catch (error) {
      writeErrorLog('Storage', error);
      //console.log("getObject error:", error);
      return undefined;
    }
  }

  public async remove(keyToRemove: string) {
    return this._storage.removeItem(keyToRemove);
  }

  public clearAll(): void {
    this._storage.clear();
  }

  public async clearAllBut(keysToKeep: string[]) {
    const allKeys = Object.keys(this._storage);
    const keysToRemove = allKeys.filter(value => !keysToKeep.includes(value));
    keysToRemove.forEach(key => this._storage.removeItem(key));
  }
}

const cacheStorage = new Storage();

export default cacheStorage;
