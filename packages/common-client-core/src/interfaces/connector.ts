
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
    readonly menuConfig?: any;
    readonly navItem?: any;
    readonly navItemRight?: any;
    readonly rootComponentFactory?: any;
    readonly dataRootComponent?: any;
    readonly createFetchOptions?: any;
    readonly stylesInsert?: any;
    readonly scriptsInsert?: any;
    readonly catalogInfo?: any;
    readonly languagesFuncs?: any;
    readonly panels?: any;
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
    readonly menuConfig?: any;
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

    readonly panels: any;
    readonly rightComponents: any;

    // methods
    readonly getRouter;

    readonly getRoutes;
    readonly getConfiguredRoutes;

    readonly getMenus;
    readonly getConfiguredMenus;
    readonly navItems;
    readonly navItemsRight;

    readonly reducers;
    readonly resolvers;

    readonly connectionParams;

    readonly stylesInserts;
    readonly scriptsInserts;
    readonly panelsComponents;
    readonly rightLayoutComponents;

    getWrappedRoot(root: any, req?: any): any;
    getDataRoot(root: any): any;
    registerLanguages(monaco): void;
}
