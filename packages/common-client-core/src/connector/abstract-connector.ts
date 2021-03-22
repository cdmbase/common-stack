import * as React from 'react';
import { IFeature, IModuleShape, IClientStateConfig, IClientState, ResolverType } from '../interfaces';
import { Resolvers } from 'apollo-client';
import { merge, map, union, without, castArray } from 'lodash';
import { ErrorLink } from 'apollo-link-error';
import { ReducersMapObject } from 'redux';
import { interfaces, Container } from 'inversify';
import { IdGetterObj } from 'apollo-cache-inmemory';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);
export const featureCatalog = {};


export abstract class AbstractFeature implements IFeature {
    public link: any;
    public errorLink: ErrorLink[];
    public createFetch: any;
    public connectionParam: any;
    public epic: any;
    public reducer: ReducersMapObject[];
    public reduxContext: any;
    public clientStateParams?: IClientStateConfig[];
    public sidebarSegments: any[];
    public routerFactory: any;
    public route: any;
    public drawerItem: any;
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
    public dataIdFromObject: { [key: string]: (value: any) => string }[];
    public createContainerFunc: Function[];
    public createServiceFunc: Function[];
    public leftMainPanelItems: any;
    public middleMainPanelItems: any;
    public middleMainPanelItemsProps: any;
    public leftFooterItems: any;
    public rightFooterItems: any;
    public middleLowerPanelItems: any;

    private container: interfaces.Container;
    private services;
    /**
     * Constructs Client feature module representation, that folds all the feature modules
     * into a single module represented by this instance.
     * @param feature
     * @param features
     */
    constructor(
        feature?: IModuleShape,
        // tslint:disable:trailing-comma
        ...features: IModuleShape[]
    ) {
        this.reduxContext = combine(arguments, (arg: IModuleShape) => arg.reduxContext);

        // Connectivity
        this.link = combine(arguments, (arg: IModuleShape) => arg.link);
        this.errorLink = combine(arguments, (arg: IModuleShape) => arg.errorLink);

        this.createFetch = combine(arguments, (arg: IModuleShape) => arg.createFetch)
            .slice(-1)
            .pop();
        this.connectionParam = combine(arguments, (arg: IModuleShape) => arg.connectionParam);

        // State management
        this.reducer = combine(arguments, (arg: IModuleShape) => arg.reducer);
        // Client side schema for apollo-link-state
        this.clientStateParams = combine(arguments, (arg: IModuleShape) => arg.clientStateParams);

        // Epic actions
        this.epic = combine(arguments, (arg: IModuleShape) => arg.epic);


        this.sidebarSegments = combine(arguments, (arg: IModuleShape) => arg.sidebarSegments);

        this.leftMainPanelItems = combine(arguments, (arg: IModuleShape) => arg.leftMainPanelItems);
        this.middleMainPanelItems = combine(arguments, (arg: IModuleShape) => arg.middleMainPanelItems);
        this.middleMainPanelItemsProps = combine(arguments, (arg: IModuleShape) => arg.middleMainPanelItemsProps);
        this.leftFooterItems = combine(arguments, (arg: IModuleShape) => arg.leftFooterItems);
        this.rightFooterItems = combine(arguments, (arg: IModuleShape) => arg.rightFooterItems);
        this.middleLowerPanelItems = combine(arguments, (arg: IModuleShape) => arg.middleLowerPanelItems);
        this.dataIdFromObject = combine(arguments, (arg: IModuleShape) => arg.dataIdFromObject);

        this.drawerItem = combine(arguments, (arg: IModuleShape) => arg.drawerItem);

        this.navItem = combine(arguments, (arg: IModuleShape) => arg.navItem);
        this.navItemRight = combine(arguments, (arg: IModuleShape) => arg.navItemRight);

        // UI provider-components
        this.rootComponentFactory = combine(arguments, (arg: IModuleShape) => arg.rootComponentFactory);
        this.dataRootComponent = combine(arguments, (arg: IModuleShape) => arg.dataRootComponent);

        // UI provider-components
        this.languagesFuncs = combine(arguments, (arg: IModuleShape) => arg.languagesFuncs);

        // container
        this.createContainerFunc = combine(arguments, arg => arg.createContainerFunc);

        // services
        this.createServiceFunc = combine(arguments, arg => arg.createServiceFunc);

        // TODO: Use React Helmet for those. Low level DOM manipulation
        this.stylesInsert = combine(arguments, (arg: IModuleShape) => arg.stylesInsert);
        this.scriptsInsert = combine(arguments, (arg: IModuleShape) => arg.scriptsInsert);


        // Shared modules data
        this.data = combine([{}].concat(Array.from(arguments)), arg => arg.data)
            .reduce(
                (acc, el) => [{ ...acc[0], ...el }],
                [{}],
            );
    }

    public get epics() {
        return this.epic;
    }

    public get getReduxContext() {
        return merge({}, ...this.reduxContext);
    }

    public getRouter(withRoot?: boolean, rootComponent?: any) {
        return this.routerFactory(this.getRoutes());
    }

    public abstract getRoutes(searchPath?: RegExp);

    public abstract get drawerItems();

    public abstract get navItems();

    public abstract get navItemsRight();

    get reducers() {
        return merge({}, ...(this.reducer || []));
    }

    public createContainers(options): interfaces.Container {
        // only create once
        if (this.container) {
            return this.container;
        }
        this.container = new Container();
        this.createContainerFunc.map(createModule => {
            this.container.load(createModule(options));
        });
        return this.container;
    }

    public createService(options, updateOptions) {
        // only create once
        if (this.services) {
            return this.services;
        }
        try {
            if (!this.container) {
                this.createContainers(options);
            }
            this.services = merge({}, ...this.createServiceFunc.map(serviceFunc => serviceFunc(this.container)));
            return this.services;
        } catch (err) {
            throw err;
        }
    }

    public getStateParams(args: { resolverContex?: any } = {}) {
        return this.clientStateParams.reduce<IClientState>(function (acc, curr) {
            const defs = curr.typeDefs ? Array.isArray(curr.typeDefs) ? curr.typeDefs : [curr.typeDefs] : [];
            const schema = defs.map(typeDef => {
                if (typeof typeDef === 'string') {
                    return typeDef;
                }
                console.warn(`Not supported AST format `, typeDef);
            })
                .map(str => str.trim())
                .join('\n');
            const typeDefs = acc.typeDefs ? acc.typeDefs.concat('\n', schema) : schema;
            const defaults = merge(acc.defaults, curr.defaults);

            const resolvers = merge(acc.resolvers, consoldidatedResolvers(curr.resolvers, args.resolverContex)) as Resolvers;
            const fragmentMatcher = merge(acc.fragmentMatcher, curr.fragmentMatcher);
            return { defaults, resolvers, typeDefs, fragmentMatcher };
        }, {} as IClientState);
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
        return merge({}, ...(this.leftMainPanelItems || []));
    }

    get middleMainPanel() {
        const panelObj = merge({}, ...(this.middleMainPanelItems || []));
        const withProps = {} as any;
        Object.keys(panelObj).forEach(key => {
            const props = this.middleMainPanelItemsProps.filter(el => !!el[key]);
            let mergedProps = [];
            props.forEach(el => {
                const insideEl = el[key];
                Object.keys(insideEl).forEach(item => {
                    if (mergedProps[item]) {
                        mergedProps[item] = [...mergedProps[item], ...insideEl[item]];
                    } else {
                        mergedProps = { ...mergedProps, [item]: insideEl[item] };
                    }
                });
            });
            return withProps[key] = React.cloneElement(
                panelObj[key],
                mergedProps,
            );
        });
        return withProps;
    }

    get leftFooter() {
        return this.leftFooterItems;
    }

    get rightFooter() {
        return this.rightFooterItems;
    }

    get middleLowerPanel() {
        return merge({}, ...(this.middleLowerPanelItems || []));
    }

    public getDataIdFromObject(result: { [key: string]: string | number, __typename?: string } | IdGetterObj) {
        const dataIdFromObject = merge({}, ...this.dataIdFromObject);
        if (dataIdFromObject[result.__typename]) {
            return dataIdFromObject[result.__typename](result);
        }
        return result.id || (result as any)._id;
    }

    public abstract getWrappedRoot(root, req);

    public abstract getDataRoot(root);

    public abstract registerLanguages(monaco);
}

function consoldidatedResolvers(resolvers: ResolverType, context): Resolvers {
    let finalResolvers;
    if (Array.isArray(resolvers)) {
        const resolverObject = (resolvers as (object[])).map(resolver => {
            return typeof resolver === 'function'
            ? resolver(context)
            : resolver;
        });
        finalResolvers = merge({}, ...resolverObject);
    } else {
        finalResolvers = typeof resolvers === 'function'
            ? resolvers(context)
            : resolvers;
    }

    return finalResolvers;
}
