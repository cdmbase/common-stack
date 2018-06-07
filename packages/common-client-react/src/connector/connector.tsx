import * as React from 'react';
import { Route } from 'react-router-dom';
import { AbstractFeature, IFeature } from '@common-stack/client-core';
import { getRoutes } from '../utils';
import { renderRoutes } from 'react-router-config';

export class Feature extends AbstractFeature implements IFeature {
    /**
     * Get the routes
     */
    get routes() {
        const configuredRoutes = this.configuredRoutes;

        return [
            ...this.route.map((component: React.ReactElement<any>, idx: number) =>
                React.cloneElement(component, { key: idx + this.route.length }),
            ), renderRoutes(configuredRoutes),
        ];
    }

    /**
     * get configured routes.
     * Note: It overwrites the any duplicate key with latest loaded key.
     * TODO: Find a way to warn when there are duplicate keys.
     */
    get configuredRoutes() {
        const routes = Object.assign({}, ...this.routeConfig);
        return getRoutes('', { ...routes });
    }

    get navItems() {
        return this.navItem.map((component: React.ReactElement<any>, idx: number) =>
            React.cloneElement(component, {
                key: component.key ? component.key : idx + this.navItem.length,
            }),
        );
    }

    get navItemsRight() {
        return this.navItemRight.map((component: React.ReactElement<any>, idx: number) =>
            React.cloneElement(component, {
                key: component.key ? component.key : idx + this.navItem.length,
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
}
