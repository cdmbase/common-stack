import { ContainerModule, interfaces } from 'inversify';

import { ETypes } from './constants';
import { FlagService } from './services';
import { IFlagService } from './interfaces';

export const moduleFunc: (settings: any, pubsub) => interfaces.ContainerModule =
    (settings: any) => new ContainerModule((bind: interfaces.Bind) => {
        bind<IFlagService>(ETypes.FlagsService)
            .to(FlagService)
            .inSingletonScope()
            .whenTargetIsDefault();
    });

