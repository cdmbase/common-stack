
export interface IFeature {

    router();

    routes();
    navItems();
    navItemsRight();

    reducers();
    resolvers();

    middlewares();
    afterwares();
    connectionParams();

    constructFetchOptions();

    stylesInserts();
    scriptsInserts();

    getWrappedRoot(root: any, req?: any): any;
}
