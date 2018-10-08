import { ICache } from './common';

export interface ICacheEngine {
    get(key: string): Promise<ICache>;
    drop(key: string): Promise<boolean>;
    invalidate(keys?: string[]): Promise<boolean>;
    set(key: string, cache: ICache): Promise<ICache>;
}
