import { IReducerRegistry } from '../interfaces';
import { ReducerRegistry } from '../impl';
import { TYPES } from '../constants';
import { ContainerModule, interfaces } from 'inversify';


export const ReduxHelperModule =
    () => new ContainerModule((bind: interfaces.Bind) => {

    bind<IReducerRegistry<any>>(TYPES.IReducerRegistry).to(ReducerRegistry).inSingletonScope();
});
