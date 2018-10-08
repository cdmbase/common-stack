import { ContainerModule, interfaces } from 'inversify';

import { Cache } from '../services';
import { Types } from '../constants';
import { Redis } from '../engines/redis-engine';
import { ICacheEngine, ICacheService } from '../interfaces';
import * as Logger from 'bunyan';

export const moduleFunc: (settings: any, pubsub) => interfaces.ContainerModule =
    (settings: any) => new ContainerModule((bind: interfaces.Bind) => {

        /**
         *
         * @returns: () => cache;
         */
        bind<interfaces.Factory<Cache>>(Types.CacheService).toFactory<Cache>((context: interfaces.Context) => {
            return () => {
                // TODO:  to make it singleton we need to check if Cache already exist then return same.
                const cacheEngine = context.container.get<ICacheEngine>(Types.CacheEngine);
                const logger = context.container.get<Logger>('Logger');
                const cache = new Cache(cacheEngine, logger);
                return cache;
            };
        }).whenTargetIsDefault();

        bind<ICacheEngine>(Types.CacheEngine)
            .toConstantValue(new Redis())
            // .inSingletonScope()
            .whenTargetIsDefault();
    });

