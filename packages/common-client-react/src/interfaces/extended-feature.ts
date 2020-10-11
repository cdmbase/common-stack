import * as React from 'react';
import {IFeature} from '@common-stack/client-core';
import {IMappedData, IRouteData} from './router';
import { IMenuData } from './menu';
import {ComponentElement} from 'react';

export interface IPlugin {
    name: string;
    icon?: string | ComponentElement<any, any> | Function;
    render: React.FC<any>;
}

export type IReactFeature = IFeature & IReactModuleShape & {

    readonly getRouter;
    /**
     * @returns client-side React route components list
     */
    readonly getRoutes;
    readonly getConfiguredRoutes;

    readonly getMenus;
    readonly getConfiguredMenus;

    readonly routeConfig: IRouteData;
    readonly menuConfig: IMappedData;

    // Related to React Slot Fill
    componentFillPlugins: IPlugin[];
    /**
     * React component of all fill of each plugin.
     */
    getComponentFillPlugins(): IPlugin[];
};

export type IReactModuleShape = {
    /**
     * @param route Route list
     */
    readonly route?: any;
    /**
     * @param routeConfig Custom route data to create React Routers
     */
    readonly routeConfig?: IRouteData | IRouteData[];

    /**
     * @param menuConfig Menu data to create side menu
     */
    readonly menuConfig?: IMenuData | IMenuData[];
    // Related to React Slot Fill
    readonly componentFillPlugins?: IPlugin[];
};
