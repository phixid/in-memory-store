const hourInSeconds = 3600;

interface StoreItem {
    data: unknown;
    expires: number;
}

interface InternalStore {
    [property: string]: StoreItem;
    [property: number]: StoreItem;
}

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


        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
        this.delete = this.delete.bind(this);

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

    public set(key: string | number, value: unknown, expires?: number): void {
        if (typeof key === 'string' || typeof key === 'number') {
            this._store[String(key)] = {
                data: value,
                expires: expires || Date.now() + this._expireTimeMs,
            };
        }
    }

    public get(key: string | number): null | StoreItem {
        if (!this._store[key]) return null;
        if (!this._store[key].expires) return null;
        if (this._store[key].expires < Date.now()) return null;

        return this._store[key];
    }

    public getAll(): {} {
        return this._store;
    }

    public delete(key: string | number): void {
        delete this._store[key];
    }

    public clear(): void {
        this._store = {};
    }

    public getConfiguration(): { cleanIntervalMs: number; expireTimeMs: number } {
        return {
            cleanIntervalMs: this._cleanIntervalMs,
            expireTimeMs: this._expireTimeMs
        };
    }
}
