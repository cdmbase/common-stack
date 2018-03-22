
export interface ClientStateParams {
    resolvers: any;
    defaults?: any;
    typeDefs?: string | string[];
}

export interface FeatureParams {
    route?: any;
    navItem?: any;
    navItemRight?: any;
    reducer?: any;
    clientStateParams?: ClientStateParams | ClientStateParams[];
    middleware?: any;
    afterware?: any;
    connectionParam?: any;
    createFetchOptions?: any;
    stylesInsert?: any;
    scriptsInsert?: any;
    rootComponentFactory?: any;
    routerFactory?: any;
    catalogInfo?: any;
}


export interface IFeature {

    router;

    routes;
    navItems;
    navItemsRight;

    reducers;
    getStateParams;

    middlewares;
    afterwares;
    connectionParams;

    constructFetchOptions;

    stylesInserts;
    scriptsInserts;

    getWrappedRoot(root: any, req?: any): any;
}
