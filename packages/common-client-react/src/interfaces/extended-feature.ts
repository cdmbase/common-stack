import * as React from 'react';
import {IFeature} from '@common-stack/client-core';
import {IMappedData, IRouteData} from './router';
import {ComponentElement} from 'react';

export interface IPlugin {
    name: string;
    icon?: string | ComponentElement<any, any> | Function;
    render: React.FC;
}

export type IReactFeature = IFeature & {
    routeConfig: IRouteData,
    menuConfig: IMappedData,
    // Related to React Slot Fill
    componentFillPlugins: IPlugin[];
    getComponentFillPlugins(): IPlugin[];
};
