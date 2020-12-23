// tslint:disable:max-line-length

import { LocalStateFragmentMatcher, Resolvers } from 'apollo-client';
import { ReducersMapObject } from 'redux';
import { ErrorLink } from 'apollo-link-error';
import { IdGetterObj } from 'apollo-cache-inmemory';

export type ResolverType = Resolvers | Resolvers[] | ((service: any) => Resolvers) | ((service: any) => Resolvers)[] | ((service: any) => any) | ((service: any) => any)[];
export interface IClientStateConfig {
    resolvers?: ResolverType; // don't need `Resolvers` type as it may conflict with the usage
    defaults?: object;
    typeDefs?: string | string[];
    fragmentMatcher?: LocalStateFragmentMatcher;
}

export interface IClientState {
    resolvers?: Resolvers; // don't need `Resolvers` type as it may conflict with the usage
    defaults?: object;
    typeDefs?: string | string[];
    fragmentMatcher?: LocalStateFragmentMatcher;
}

/**
 * ModuleShape have optional configuration to be implemented by all the feature modules
 * in the application.
 */
export interface IModuleShape {
    /**
     * @param link all `apollo-link` that need to be composed.
     * @inheritdoc https://github.com/apollographql/apollo-link
     */
    readonly link?: any;
    /**
     * @param errorLink compose all errorLink
     * @inheritdoc https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-error
     */
    readonly errorLink?: ErrorLink | ErrorLink[];
    readonly createFetch?: any;
    /**
     * @param connectionParam method that called when a client connects to the socket.
     * @inheritdoc https://github.com/apollographql/subscriptions-transport-ws#constructorurl-options-connectioncallback
     */
    readonly connectionParam?: any;
    /**
     * @param epic all `epics` that need to be composed.
     * @inheritdoc https://redux-observable.js.org/docs/basics/Epics.html
     */
    readonly epic?: any;
    /**
     * @deprecated not sure we using
     */
    readonly reduxContext?: any;
    /**
     * @param reducer Redux reducers list
     */
    readonly reducer?: ReducersMapObject | ReducersMapObject[];
    /**
     * @param clientStateParams Client side configuration of `apollo-client`
     * @inheritdoc https://github.com/apollographql/apollo-client/tree/2d65da133c156f6d808e64aee7e7fd5f7cc71d7f
     */
    readonly clientStateParams?: IClientStateConfig | IClientStateConfig[];
    /**
     * @param dataIdFromObject A function that returns an object identifier given an particular result
     * object.
     * @inheritdoc https://github.com/apollographql/apollo-client/tree/ed66999bac40226abfeada8d6c83b454636bb4b0/packages/apollo-cache-inmemory#configuration
     */
    readonly dataIdFromObject?: { [key: string]: (value: any) => string } | { [key: string]: (value: any) => string }[] | IdGetterObj;
    /**
     * @param createContainerFunc Synchronous Container Modules of inversify.
     * @inheritdoc https://github.com/inversify/InversifyJS/blob/master/wiki/container_modules.md
     */
    readonly createContainerFunc?: Function | Function[];
    /**
     * @param createServiceFunc Services
     */
    readonly createServiceFunc?: Function | Function[];
    readonly sidebarSegments?: any;
    readonly routerFactory?: any;
    /**
     * @param route Route list
     */
    readonly route?: any;
    /**
     * @param navItem Top left navigation links
     */
    readonly navItem?: any;
    /**
     * @param navItemRightTop right navigation links
     */
    readonly navItemRight?: any;
    /**
     * @param rootComponentFactory Root component factory list
     */
    readonly rootComponentFactory?: any;
    /**
     * @param dataRootComponent Data root React elements list (data root elements wraps data fetching react subtree root)
     */
    readonly dataRootComponent?: any;
    readonly createFetchOptions?: any;
    /**
     * @param stylesInsert URL list to 3rd party css scripts
     */
    readonly stylesInsert?: any;
    /**
     * @param scriptsInsert URL list to 3rd party js scripts
     */
    readonly scriptsInsert?: any;
    /**
     * @deprecated
     */
    readonly catalogInfo?: any;
    /**
     * @deprecated
     */
    readonly languagesFuncs?: any;
    /**
     * @param leftMainPanelItems Components that will be placed left panel.
     */
    readonly leftMainPanelItems?: any;
    /**
     * @param middleMainPanelItems Components that will be placed middle center panel
     */
    readonly middleMainPanelItems?: any;
    /**
     * @param middleMainPanelItemsProps Props of the component that will be placed middle center panel
     */
    readonly middleMainPanelItemsProps?: any;
    /**
     * @param leftFooterItems Components that will be placed left footer panel
     */
    readonly leftFooterItems?: any;
    /**
     * @param rightFooterItems Components that will be placed right footer panel
     */
    readonly rightFooterItems?: any;
    /**
     * @param middleLowerPanelItems Components that will be placed below middle panel
     */
    readonly middleLowerPanelItems?: any;

}


/**
 * Feature module methods
 */
export interface IFeature extends IModuleShape {
    // Public variables
    readonly data: any[];

    /**
     * @returns Redux-Observable Epics
     */
    readonly epics;

    readonly getRouter;
    /**
     * @returns client-side React route components list
     */
    readonly getRoutes;

    /**
     * @returns client-side top left navbar link component list
     */
    readonly navItems;
    /**
     * @returns client-side top right navbar link component list
     */
    readonly navItemsRight;
    /**
     * @returns Redux reducers
     */
    readonly reducers;

    readonly connectionParams;

    /**
     * @returns URL list to 3rd party css styles
     */
    readonly stylesInserts;
    /**
     * @returns URL list to 3rd party js styles
     */
    readonly scriptsInserts;

    readonly leftMainPanel;
    readonly middleMainPanel;
    readonly leftFooter;
    readonly rightFooter;
    readonly middleLowerPanel;
    readonly dataIdFromObject;

    /**
     * @param args Options to pass to each Container Module
     * @returns Created container and binds all the container modules
     */
    createContainers(args);


    createService(options, updateOptions);
    /**
     * @param args Provide resolverContext which can be passed to all resolver functions.
     * @returns IClientState
     */
    getStateParams(args?: { resolverContex?: any }): IClientState;

    getDataIdFromObject(result: {
        [key: string]: string | number;
        __typename?: string;
    } | IdGetterObj): any;
    /**
     * @arguments root React tree root component
     * @arguments req Http Request
     * @returns React tree root component wrapped up by root components exposed by this module
     */
    getWrappedRoot(root: any, req?: any): any;
    /**
     * @param root React tree data root component (first React root components which is used for fetching data)
     *
     * @returns React tree data root component wrapped up by data root components exposed by this module
     */
    getDataRoot(root: any): any;
    registerLanguages(monaco): void;
}
