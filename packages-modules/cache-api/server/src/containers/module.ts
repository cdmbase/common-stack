import { ContainerModule, interfaces } from 'inversify';

import { Cache } from '../services';
import { Types } from '../constants';
import { Redis } from '../engines/Redis';
import { ICacheEngine, ICacheService } from '../interfaces';

export const moduleFunc: (settings: any, pubsub) => interfaces.ContainerModule =
    (settings: any) => new ContainerModule((bind: interfaces.Bind) => {
        bind(Types.CacheService)
            .to(Cache)
            .inSingletonScope()
            .whenTargetIsDefault();

        bind<ICacheEngine>(Types.CacheEngine)
            .to(Redis)
            .inSingletonScope()
            .whenTargetIsDefault();
    });

