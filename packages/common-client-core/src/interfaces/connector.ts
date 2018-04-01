
export interface ClientStateParams {
    resolvers: any;
    defaults?: any;
    typeDefs?: string | string[];
}

export interface FeatureParams {
    link?: any;
    createFetch?: any;
    connectionParam?: any;
    reducer?: any;
    resolver?: any;
    routerFactory?: any;
    route?: any;
    navItem?: any;
    navItemRight?: any;
    rootComponentFactory?: any;
    dataRootComponent?: any;
    createFetchOptions?: any;
    stylesInsert?: any;
    scriptsInsert?: any;
    catalogInfo?: any;
}


export interface IFeature {
    router;

    routes;
    navItems;
    navItemsRight;

    reducers;
    resolvers;

    connectionParams;

    stylesInserts;
    scriptsInserts;

    getWrappedRoot(root: any, req?: any): any;
    getDataRoot(root: any): any;
}
