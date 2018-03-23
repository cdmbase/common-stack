import { IFeature, FeatureParams, ClientStateParams } from '../interfaces';
import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);
export const featureCatalog = {};


export abstract class AbstractFeature implements IFeature {
    public route: any[];
    public navItem: any[];
    public navItemRight: any[];
    public reducer: any[];
    public clientStateParams: ClientStateParams[];
    public middleware: any[];
    public afterware: any[];
    public connectionParam: any[];
    public createFetchOptions: any[];
    public stylesInsert: any[];
    public scriptsInsert: any[];
    public rootComponentFactory: any[];
    public routerFactory: any;
    public catalogInfo: any[];

    constructor(
        feature?: FeatureParams,
        ...features,
    ) {
        /* eslint-enable no-unused-vars */
        combine(arguments, arg => arg.catalogInfo).forEach(info =>
            Object.keys(info).forEach(key => (featureCatalog[key] = info[key])),
        );
        this.route = combine(arguments, (arg: FeatureParams) => arg.route);
        this.navItem = combine(arguments, (arg: FeatureParams) => arg.navItem);
        this.navItemRight = combine(arguments, (arg: FeatureParams) => arg.navItemRight);
        this.reducer = combine(arguments, (arg: FeatureParams) => arg.reducer);
        this.clientStateParams = combine(arguments, (arg: FeatureParams) => arg.clientStateParams);
        this.middleware = combine(arguments, (arg: FeatureParams) => arg.middleware);
        this.afterware = combine(arguments, (arg: FeatureParams) => arg.afterware);
        this.connectionParam = combine(arguments, (arg: FeatureParams) => arg.connectionParam);
        this.createFetchOptions = combine(arguments, (arg: FeatureParams) => arg.createFetchOptions);
        this.stylesInsert = combine(arguments, (arg: FeatureParams) => arg.stylesInsert);
        this.scriptsInsert = combine(arguments, (arg: FeatureParams) => arg.scriptsInsert);
        this.rootComponentFactory = combine(arguments, (arg: FeatureParams) => arg.rootComponentFactory);
        this.routerFactory = combine(arguments, (arg: FeatureParams) => arg.routerFactory)
            .slice(-1)
            .pop();
    }

    get router() {
        return this.routerFactory(this.routes);
    }

    public abstract get routes();

    public abstract get navItems();

    public abstract get navItemsRight();

    get reducers() {
        return merge(...this.reducer);
    }

    get getStateParams() {
        return merge({}, ...this.clientStateParams);
    }

    get middlewares() {
        return this.middleware;
    }

    get afterwares() {
        return this.afterware;
    }

    get connectionParams() {
        return this.connectionParam;
    }

    get constructFetchOptions() {
        return this.createFetchOptions.length
            ? (...args) => {
                try {
                    let result = {};
                    for (let func of this.createFetchOptions) {
                        result = { ...result, ...func(...args) };
                    }
                    return result;
                } catch (e) {
                    console.log(e.stack);
                }
            }
            : null;
    }

    get stylesInserts() {
        return this.stylesInsert;
    }

    get scriptsInserts() {
        return this.scriptsInsert;
    }

    public abstract getWrappedRoot(root, req);
}
