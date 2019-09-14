import * as React from 'react';
import { IFeature, IModuleShape, IClientStateConfig } from '../interfaces';
import { merge, map, union, without, castArray } from 'lodash';
import { IdGetter } from 'apollo-cache-inmemory';
import { ErrorLink } from 'apollo-link-error';
import { ReducersMapObject } from 'redux';

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
    public dataIdFromObject: { [key: string]: IdGetter }[];

    public leftMainPanelItems: any;
    public middleMainPanelItems: any;
    public middleMainPanelItemsProps: any;
    public leftFooterItems: any;
    public rightFooterItems: any;
    public middleLowerPanelItems: any;

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

        // Navigation
        this.routerFactory = combine(arguments, (arg: IModuleShape) => arg.routerFactory)
            .slice(-1)
            .pop();
        this.route = combine(arguments, (arg: IModuleShape) => arg.route);
        this.routeConfig = combine(arguments, (arg: IModuleShape) => arg.routeConfig);

        this.menuConfig = combine(arguments, (arg: IModuleShape) => arg.menuConfig);
        this.navItem = combine(arguments, (arg: IModuleShape) => arg.navItem);
        this.navItemRight = combine(arguments, (arg: IModuleShape) => arg.navItemRight);

        // UI provider-components
        this.rootComponentFactory = combine(arguments, (arg: IModuleShape) => arg.rootComponentFactory);
        this.dataRootComponent = combine(arguments, (arg: IModuleShape) => arg.dataRootComponent);

        // UI provider-components
        this.languagesFuncs = combine(arguments, (arg: IModuleShape) => arg.languagesFuncs);


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
        return this.routerFactory(this.getRoutes(withRoot, rootComponent));
    }

    public abstract getRoutes(withRoot?: boolean, rootComponent?: any);

    public abstract getConfiguredRoutes(routeSearch?: string);

    public abstract getMenus(withRoot?: boolean, rootComponent?: any);

    public abstract getConfiguredMenus(routeSearch?: string);

    public abstract get navItems();

    public abstract get navItemsRight();

    get reducers() {
        return merge({}, ...(this.reducer || []));
    }

    get getStateParams(): IClientStateConfig {
        return this.clientStateParams.reduce<IClientStateConfig>(function (acc, curr) {
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
            const resolvers = merge(acc.resolvers, curr.resolvers);
            const fragmentMatcher = merge(acc.fragmentMatcher, curr.fragmentMatcher);
            return { defaults, resolvers, typeDefs, fragmentMatcher };
        }, {} as IClientStateConfig);
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

    public getDataIdFromObject(result: { [key: string]: string | number, __typename?: string }) {
        const dataIdFromObject = merge({}, ...this.dataIdFromObject);
        if (dataIdFromObject[result.__typename]) {
            return dataIdFromObject[result.__typename](result);
        }
        return result.id || result._id;
    }

    public abstract getWrappedRoot(root, req);

    public abstract getDataRoot(root);

    public abstract registerLanguages(monaco);
}
