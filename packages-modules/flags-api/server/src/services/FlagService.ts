import * as Logger from 'bunyan';
import { inject, injectable } from 'inversify';

import { ETypes } from '../constants';
import { IFlag } from '../../../common';
import { IFlagService, IFlagSetRequest, IFlagGetRequest, IFlagStore } from '../interfaces/IFlagService';

@injectable()
export class FlagService implements IFlagService {
    private logger: Logger;

    constructor(
        @inject('Logger') logger: Logger,
        @inject(ETypes.FlagsStore) private store: IFlagStore,
    ) {
        this.logger = logger.child({ className: FlagService });
    }

    public set(request: IFlagSetRequest): any {
        this.logger.debug('Setting flag with params %o', request);
        return this.store.set(request);
    }

    public get(request: IFlagGetRequest) {
        this.logger.debug('Fetching flag %o', request);
        return this.store.get(request);
    }

    public delete(request: IFlagGetRequest) {
        this.logger.debug('Deleting flag %o', request);
        return this.store.delete(request);
    }
}