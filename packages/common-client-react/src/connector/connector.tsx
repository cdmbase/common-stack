import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import {AbstractFeature, IModuleShape} from '@common-stack/client-core';
import * as Logger from 'bunyan';
import {IPlugin, IReactFeature, IReactModuleShape} from '../interfaces';
import {getMenus, getRoutes} from '../utils';
import {castArray, map, union, without} from 'lodash';
import {registerPlugin, getPlugins, getPlugin} from '../plugin-area/plugin-api';

const combine = (features, extractor) => without(union(...map(features,
        res => castArray(extractor(res)))), undefined);

type FeautureParam = IModuleShape & IReactModuleShape;
export class Feature extends AbstractFeature implements IReactFeature {
    private logger;
    public componentFillPlugins;
    
    public routerFactory: any;
    public route: any;
    public routeConfig: any;
    public menuConfig: any;
    constructor(
        feature?: FeautureParam,
        // tslint:disable:trailing-comma
        ...features: FeautureParam[]
    ) {
        super(feature, ...features);
        this.logger = Logger.createLogger({
            name: Feature.name
        });


        // Navigation
        this.routerFactory = combine(arguments, (arg: FeautureParam) => arg.routerFactory)
            .slice(-1)
            .pop();
        this.route = combine(arguments, (arg: FeautureParam) => arg.route);
        this.routeConfig = combine(arguments, (arg: FeautureParam) => arg.routeConfig);

        this.menuConfig = combine(arguments, (arg: FeautureParam) => arg.menuConfig);

        this.componentFillPlugins = this.registerComponentFillPlugins(combine(arguments,
            (arg: FeautureParam) => arg.componentFillPlugins));
    }

    /* tslint:disable:jsx-no-lambda */
    private renderRoutes = (routes, solidRoutes, extraProps = {}, switchProps = {}) =>
        routes ? (
            <Switch {...switchProps}>
                {[
                    ...solidRoutes, ...routes.map((route, i) => (
                        <Route
                            key={route.key || i}
                            path={route.path}
                            exact={route.exact}
                            strict={route.strict}
                            render={props => (
                                <route.component {...props} {...extraProps} route={route}/>
                            )}
                        />
                    )),
                ]}
            </Switch>
        ) : null

    /**
     * Get the routes
     */
    public getRoutes(withRoot?: boolean, rootComponent?: any) {
        const configuredRoutes = this.getConfiguredRoutes();
        const solidRoutes = this.route.map((component: React.ReactElement<any>, idx: number) =>
            React.cloneElement(component, {key: component.props.path}));
        return this.renderRoutes(configuredRoutes, solidRoutes);
    }

    /**
     * Get menus
     */
    public getMenus(withRoot?: boolean, rootComponent?: any) {
        return this.getConfiguredMenus();
    }

    /**
     * get configured routes.
     * Note: It overwrites the any duplicate key with latest loaded key.
     * TODO: Find a way to warn when there are duplicate keys.
     */
    public getConfiguredRoutes(searchPath = '/') {
        const routes = Object.assign({}, ...this.routeConfig);
        return getRoutes(searchPath, {...routes});
    }


    /**
     * get configured menus.
     * Note: It overwrites the any duplicate key with latest loaded key.
     * TODO: Find a way to warn when there are duplicate keys.
     */
    public getConfiguredMenus(searchPath = '/') {
        const routes = Object.assign({}, ...this.menuConfig);
        return getMenus(searchPath, {...routes});
    }

    get navItems() {
        return this.navItem.map((component: React.ReactElement<any>, idx: number) =>
            React.cloneElement(component, {
                key: component.key ? component.key : idx + this.navItem.length,
            }),
        );
    }

    get navItemsRight() {
        return this.navItemsRight.map((component: React.ReactElement<any>, idx: number) =>
            React.cloneElement(component, {
                key: component.key ? component.key : idx + this.navItems.length,
            }),
        );
    }

    public getWrappedRoot(root: React.ReactNode, req?: any): React.ReactNode {
        let nestedRoot = root;
        for (const componentFactory of this.rootComponentFactory) {
            nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
        }
        return nestedRoot;
    }

    public getDataRoot(root) {
        let nestedRoot = root;
        for (const component of this.dataRootComponent) {
            nestedRoot = React.createElement(component, {}, nestedRoot);
        }
        return nestedRoot;
    }

    public registerLanguages(monaco) {
        for (const func of this.languagesFuncs) {
            func(monaco);
        }
    }

    private registerComponentFillPlugins(plugins): void {
        plugins.forEach((i) => {
            const {name} = i;
            const isFound = !!getPlugin(name);
            if (!isFound) {
                registerPlugin(name, i);
            }
        });
        return plugins;
    }

    public getComponentFillPlugins() {
        return getPlugins();
    }
}
