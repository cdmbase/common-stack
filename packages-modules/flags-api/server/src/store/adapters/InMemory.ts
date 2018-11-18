import { IFlag } from '../../../../common';
import { IFlagStore, IFlagSetRequest, IFlagGetRequest } from '../../interfaces';

export type UnifiedFlagRequest = IFlagGetRequest | IFlagSetRequest;

export class InMemory implements IFlagStore {
    private __memory = new Map<string, any>();

    private key(request: UnifiedFlagRequest) {
        const { key, scope } = request;
        return `${scope}.${key}`;
    }

    public async set(request: IFlagSetRequest) {
        this.__memory.set(this.key(request), JSON.stringify(request));
        return request as any;
    }

    public async get(request: IFlagGetRequest) {
        const record = this.__memory.get(this.key(request));

        return !record 
            ? null
            : JSON.parse(record);
    }

    public async delete(request: IFlagGetRequest) {
        this.__memory.delete(this.key(request));
        return true;
    }
}