import { IFeature, FeatureParams, ClientStateParams } from '../interfaces';
import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);
export const featureCatalog = {};


export abstract class AbstractFeature implements IFeature {
    public link: any;
    public createFetch: any;
    public connectionParam: any;
    public reducer: any;
    public resolver: any;
    public routerFactory: any;
    public route: any;
    public routeConfig: any;
    public menuConfig: any;
    public navItem: any;
    public navItemRight: any;
    public rootComponentFactory: any[];
    public dataRootComponent: any[];
    public createFetchOptions: any[];
    public stylesInsert: any[];
    public scriptsInsert: any[];
    public catalogInfo: any[];
    public languagesFuncs: any[];
    public data: any[];
    public leftComponents: any;
    public rightComponents: any;
    public footerLeftComponents: any;
    public footerRightComponents: any;
    public leftFooterComponents: any;
    public rightFooterComponents: any;

    constructor(
        feature?: FeatureParams,
        ...features,
    ) {

        // Connectivity
        this.link = combine(arguments, arg => arg.link);
        this.createFetch = combine(arguments, arg => arg.createFetch)
            .slice(-1)
            .pop();
        this.connectionParam = combine(arguments, arg => arg.connectionParam);

        // State management
        this.reducer = combine(arguments, arg => arg.reducer);
        this.resolver = combine(arguments, arg => arg.resolver);

        this.leftComponents = combine(arguments, arg => arg.leftComponents);
        this.rightComponents = combine(arguments, arg => arg.rightComponents);
        this.leftFooterComponents = combine(arguments, arg => arg.leftFooterComponents);
        this.rightFooterComponents = combine(arguments, arg => arg.rightFooterComponents);

        // Navigation
        this.routerFactory = combine(arguments, arg => arg.routerFactory)
            .slice(-1)
            .pop();
        this.route = combine(arguments, arg => arg.route);
        this.routeConfig = combine(arguments, arg => arg.routeConfig);

        this.menuConfig = combine(arguments, arg => arg.menuConfig);
        this.navItem = combine(arguments, arg => arg.navItem);
        this.navItemRight = combine(arguments, arg => arg.navItemRight);

        // UI provider-components
        this.rootComponentFactory = combine(arguments, arg => arg.rootComponentFactory);
        this.dataRootComponent = combine(arguments, arg => arg.dataRootComponent);

        // UI provider-components
        this.languagesFuncs = combine(arguments, arg => arg.languagesFuncs);


        // TODO: Use React Helmet for those. Low level DOM manipulation
        this.stylesInsert = combine(arguments, arg => arg.stylesInsert);
        this.scriptsInsert = combine(arguments, arg => arg.scriptsInsert);


        // Shared modules data
        this.data = combine([{}].concat(Array.from(arguments)), arg => arg.data)
            .reduce(
                (acc, el) => [{ ...acc[0], ...el }],
                [{}],
        );
    }

    public getRouter(withRoot?: boolean, rootComponent?: any) {
        return this.routerFactory(this.getRoutes(withRoot, rootComponent));
    }

    public abstract getRoutes(withRoot?: boolean, rootComponent?: any);

    public abstract getConfiguredRoutes(routeSearch?: string);

    public abstract getMenus(withRoot?: boolean, rootComponent?: any);

    public abstract getConfiguredMenus(routeSearch?: string);

    public abstract get navItems();

    public abstract get navItemsRight();

    get reducers() {
        return merge(...this.reducer);
    }

    get resolvers() {
        return merge(...this.resolver);
    }


    get connectionParams() {
        return this.connectionParam;
    }

    get stylesInserts() {
        return this.stylesInsert;
    }

    get scriptsInserts() {
        return this.scriptsInsert;
    }

    get leftLayoutComponents() {
        return merge(...this.leftComponents);
    }

    get rightLayoutComponents() {
        return merge(...this.rightComponents);
    }

    get leftFooterLayoutComponents() {
        return merge(...this.leftFooterComponents);
    }

    get rightFooterLayoutComponents() {
        return merge(...this.rightFooterComponents);
    }

    public abstract getWrappedRoot(root, req);

    public abstract getDataRoot(root);

    public abstract registerLanguages(monaco);
}
