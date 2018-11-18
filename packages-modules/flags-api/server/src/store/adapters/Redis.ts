import * as _ from 'lodash';
import { inject, injectable } from 'inversify';

import { ETypes } from '../../constants';
import { IFlag } from '../../../../common';
import { IFlagStore, IFlagSetRequest, IFlagGetRequest, UnifiedFlagRequest } from '../../interfaces';

@injectable()
export class Redis implements IFlagStore {
    public async get(request: IFlagSetRequest): Promise<any> {
        throw new Error('Not implemented');
    }
    public async set(request: IFlagGetRequest): Promise<any> {
        throw new Error('Not implemented');
    }
    public async delete(request: IFlagGetRequest): Promise<any> {
        throw new Error('Not implemented');
    }
}