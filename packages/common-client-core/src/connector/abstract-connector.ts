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

        // Navigation
        this.routerFactory = combine(arguments, arg => arg.routerFactory)
            .slice(-1)
            .pop();
        this.route = combine(arguments, arg => arg.route);
        this.navItem = combine(arguments, arg => arg.navItem);
        this.navItemRight = combine(arguments, arg => arg.navItemRight);
        this.routeConfig = combine(arguments, arg => arg.routeConfig);

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

    get router() {
        return this.routerFactory(this.routes);
    }

    public abstract get routes();

    public abstract get configuredRoutes();

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

    public abstract getWrappedRoot(root, req);

    public abstract getDataRoot(root);

    public abstract registerLanguages(monaco);
}
