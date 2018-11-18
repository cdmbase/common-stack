import { ContainerModule, interfaces } from 'inversify';

import { Mongodb } from './adapters';
import { ETypes } from '../constants';
import { IFlagStore } from '../interfaces';

export const storeModuleFunc: (settings: any, pubsub) => interfaces.ContainerModule =
    (settings: any) => new ContainerModule((bind: interfaces.Bind) => {
        bind(ETypes.DBConnection).toConstantValue(settings.mongoConnection);

        bind<IFlagStore>(ETypes.FlagsStore)
            .to(Mongodb)
            .inSingletonScope()
            .whenTargetIsDefault();
    });

