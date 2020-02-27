const hourInSeconds = 3600;

export class Store {
  private _store: InternalStore;
  private _cleanInterval: any;
  private readonly _cleanIntervalMs: number;
  private readonly _expireTimeMs: number;

  public constructor(expireTimeSeconds: number = hourInSeconds, cleanIntervalSeconds: number = 0) {
    this._store = {};
    this._cleanInterval = 0;
    this._cleanIntervalMs = cleanIntervalSeconds * 1000;
    this._expireTimeMs = expireTimeSeconds * 1000;

    this.clear = this.clear.bind(this);
    this.delete = this.delete.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.set = this.set.bind(this);

    if (this._cleanIntervalMs !== 0) {
      this._cleanInterval = setInterval(() => {
        Object.keys(this._store).forEach((storeItemKey: string | number) => {
          if (this._store[storeItemKey].expires <= Date.now()) {
            this.delete(storeItemKey);
          }
        });
      }, this._cleanIntervalMs);
    }
  }

  public clear(): void {
    this._store = {};
  }

  public delete(key: string | number): void {
    if (key === 'constructor' || key === '__proto__') return;
    delete this._store[key];
  }

  public get(key: string | number): unknown {
    if (!this._store[key]?.expires || !this._store[key]?.data) return null;
    if (this._store[key].expires < Date.now()) return null;

    return this._store[key].data;
  }

  public getAll(): InternalStore {
    return this._store;
  }

  public getConfiguration(): { cleanIntervalMs: number; expireTimeMs: number } {
    return {
      cleanIntervalMs: this._cleanIntervalMs,
      expireTimeMs: this._expireTimeMs,
    };
  }

  public async memo(key: string | number, callback: () => unknown | Promise<unknown> ): Promise<unknown> {
    if (!key || !callback) return null;

    const previousCachedValue = this.get(key);
    if (previousCachedValue) return previousCachedValue;

    const callbackInvocation = callback();
    let callbackResult;

    if (callbackInvocation instanceof Promise) callbackResult = await callbackInvocation;
    else callbackResult = callbackInvocation;

    this.set(key, callbackResult);
    return callbackResult;
  };

  public set(key: string | number, value: any, expires?: number): void {
    if (typeof key !== 'string' && typeof key !== 'number') return;
    if (key === 'constructor' || key === '__proto__') return;

    this._store[String(key)] = {
      data: value,
      expires: expires || Date.now() + this._expireTimeMs,
    };
  }
}

interface InternalStore {
  [property: string]: any;
  [property: number]: any;
}
