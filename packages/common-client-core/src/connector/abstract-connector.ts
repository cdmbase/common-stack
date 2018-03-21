import { IFeature } from '../interfaces';
import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);
export const featureCatalog = {};

export abstract class AbstractFeature implements IFeature {
    protected route;
    protected navItem;
    protected navItemRight;
    protected reducer;
    protected resolver;
    protected middleware;
    protected afterware;
    protected connectionParam;
    protected createFetchOptions;
    protected stylesInsert;
    protected scriptsInsert;
    protected rootComponentFactory;
    protected routerFactory;

    constructor(
        {
          route,
            navItem,
            navItemRight,
            reducer,
            resolver,
            middleware,
            afterware,
            connectionParam,
            createFetchOptions,
            stylesInsert,
            scriptsInsert,
            rootComponentFactory,
            routerFactory,
            catalogInfo,
        },
        ...features,
    ) {
        /* eslint-enable no-unused-vars */
        combine(arguments, arg => arg.catalogInfo).forEach(info =>
            Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
        );
        this.route = combine(arguments, arg => arg.route);
        this.navItem = combine(arguments, arg => arg.navItem);
        this.navItemRight = combine(arguments, arg => arg.navItemRight);
        this.reducer = combine(arguments, arg => arg.reducer);
        this.resolver = combine(arguments, arg => arg.resolver);
        this.middleware = combine(arguments, arg => arg.middleware);
        this.afterware = combine(arguments, arg => arg.afterware);
        this.connectionParam = combine(arguments, arg => arg.connectionParam);
        this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
        this.stylesInsert = combine(arguments, arg => arg.stylesInsert);
        this.scriptsInsert = combine(arguments, arg => arg.scriptsInsert);
        this.rootComponentFactory = combine(arguments, arg => arg.rootComponentFactory);
        this.routerFactory = combine(arguments, arg => arg.routerFactory)
            .slice(-1)
            .pop();
    }

    public router() {
        return this.routerFactory();
    }

    public abstract routes();

    public abstract navItems();

    public abstract navItemsRight();

    public reducers() {
        return merge(...this.reducer);
    }

    public resolvers() {
        return merge(...this.resolver);
    }

    public middlewares() {
        return this.middleware;
    }

    public afterwares() {
        return this.afterware;
    }

    public connectionParams() {
        return this.connectionParam;
    }

    public constructFetchOptions() {
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

    public stylesInserts() {
        return this.stylesInsert;
    }

    public scriptsInserts() {
        return this.scriptsInsert;
    }

    public abstract getWrappedRoot(root, req);
}
