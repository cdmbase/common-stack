import * as _ from 'lodash';
import { Connection } from 'mongoose';
import { inject, injectable } from 'inversify';

import { ETypes } from '../../constants';
import { IFlag } from '../../../../common';
import { FlagModelFunc, FlagModelType, IFlagModel } from '../models/FlagModel';
import { IFlagStore, IFlagSetRequest, IFlagGetRequest, UnifiedFlagRequest } from '../../interfaces';

@injectable()
export class Mongodb implements IFlagStore {
    model: FlagModelType;

    constructor(
        @inject(ETypes.DBConnection) connection: Connection,
    ) {
        this.model = FlagModelFunc(connection);
    }
    
    private query(request: UnifiedFlagRequest) {
        return _.pick(request, ['key', 'scope']);
    }

    public async set(request: IFlagSetRequest) {
        let flag = await this.get(request);

        if(!flag) {
            return this.model.create(request);
        }

        _.assign(flag, request);
        const ok = await flag.save();

        return flag;
    }

    public async get(request: IFlagGetRequest) {
        return this.model.findOne(this.query(request));
    }

    public async delete(request: IFlagGetRequest) {
        this.model.findOneAndRemove(this.query(request));
        return true;
    }
}