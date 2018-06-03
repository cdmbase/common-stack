
export interface ClientStateParams {
    resolvers: any;
    defaults?: any;
    typeDefs?: string | string[];
}

export interface FeatureParams {
    readonly link?: any;
    readonly createFetch?: any;
    readonly connectionParam?: any;
    readonly reducer?: any;
    readonly resolver?: any;
    readonly routerFactory?: any;
    readonly route?: any;
    readonly routeConfig?: any;
    readonly navItem?: any;
    readonly navItemRight?: any;
    readonly rootComponentFactory?: any;
    readonly dataRootComponent?: any;
    readonly createFetchOptions?: any;
    readonly stylesInsert?: any;
    readonly scriptsInsert?: any;
    readonly catalogInfo?: any;
    readonly languagesFuncs?: any;
}


export interface IFeature {
    // Public variables
    readonly link: any;
    readonly createFetch: any;
    readonly connectionParam: any;
    readonly reducer: any;
    readonly resolver: any;
    readonly routerFactory: any;
    readonly route: any;
    readonly routeConfig: any;
    readonly navItem: any;
    readonly navItemRight: any;
    readonly rootComponentFactory: any[];
    readonly dataRootComponent: any[];
    readonly createFetchOptions: any[];
    readonly stylesInsert: any[];
    readonly scriptsInsert: any[];
    readonly catalogInfo: any[];
    readonly languagesFuncs: any[];
    readonly data: any[];

    // methods
    readonly router;

    readonly routes;
    readonly configuredRoutes;
    readonly navItems;
    readonly navItemsRight;

    readonly reducers;
    readonly resolvers;

    readonly connectionParams;

    readonly stylesInserts;
    readonly scriptsInserts;

    getWrappedRoot(root: any, req?: any): any;
    getDataRoot(root: any): any;
    registerLanguages(monaco): void;
}
