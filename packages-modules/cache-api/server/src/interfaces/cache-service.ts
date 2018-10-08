export interface ICacheOptions {
    parse?: string;
    scope?: string;
}

export interface ICacheSetOptions extends ICacheOptions {
    maxAge?: number;
    createdAt?: any;
}

export interface ICacheService {
    defaults: ICacheSetOptions;

    invalidate(key: string): Promise<boolean>;
    get(key: string, options: ICacheOptions): Promise<any>;
    drop(key: string, options: ICacheOptions): Promise<boolean>;
    invalidate(keys?: string[], options?: ICacheOptions): Promise<boolean>;
    set(key: string, data: any, options?: ICacheSetOptions): Promise<any>;
}
