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
    public schema: any[];
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
    public dataIdFromObject: any[];

    public leftMainPanelItems: any;
    public middleMainPanelItems: any;
    public leftFooterItems: any;
    public rightFooterItems: any;
    public middleLowerPanelItems: any;

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

        // Client side schema for apollo-link-state
        this.schema = combine(arguments, arg => arg.schema);
        this.resolver = combine(arguments, arg => arg.resolver);

        this.leftMainPanelItems = combine(arguments, arg => arg.leftMainPanelItems);
        this.middleMainPanelItems = combine(arguments, arg => arg.middleMainPanelItems);
        this.leftFooterItems = combine(arguments, arg => arg.leftFooterItems);
        this.rightFooterItems = combine(arguments, arg => arg.rightFooterItems);
        this.middleLowerPanelItems = combine(arguments, arg => arg.middleLowerPanelItems);
        this.dataIdFromObject = combine(arguments, arg => arg.dataIdFromObject);

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

    get leftMainPanel() {
        return merge(...this.leftMainPanelItems);
    }

    get middleMainPanel() {
        return merge(...this.middleMainPanelItems);
    }

    get leftFooter() {
        return this.leftFooterItems;
    }

    get rightFooter() {
        return this.rightFooterItems;
    }

    get middleLowerPanel() {
        return merge(...this.middleLowerPanelItems);
    }

    public abstract getDataIdFromObject(result: any);

    public abstract getWrappedRoot(root, req);

    public abstract getDataRoot(root);

    public abstract registerLanguages(monaco);
}
