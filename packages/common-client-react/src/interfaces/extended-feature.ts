import { IFeature } from '@common-stack/client-core';
import { IRouteData, IMappedData } from './router';

export type IReactFeature = IFeature & {
    routeConfig: IRouteData,
    menuConfig: IMappedData,
};
