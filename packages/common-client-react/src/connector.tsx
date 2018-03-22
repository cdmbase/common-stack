import * as React from 'react';

import { AbstractFeature, IFeature } from '@common-stack/client-core';


export class Feature extends AbstractFeature implements IFeature {
    get routes() {
        return this.route.map((component, idx) => React.cloneElement(component, { key: idx + this.route.length }));
    }

    get navItems() {
        return this.navItem.map((component, idx) =>
            React.cloneElement(component, {
                key: component.key ? component.key : idx + this.navItem.length,
            }),
        );
    }

    get navItemsRight() {
        return this.navItemRight.map((component, idx) =>
            React.cloneElement(component, {
                key: component.key ? component.key : idx + this.navItem.length,
            }),
        );
    }

    public getWrappedRoot(root, req) {
        let nestedRoot = root;
        for (const componentFactory of this.rootComponentFactory) {
            nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
        }
        return nestedRoot;
    }

}
