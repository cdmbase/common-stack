import * as React from 'react';
import { IRoute as IRouteProps, IRouteComponentProps } from '@common-stack/client-react';
import { IScreen,  } from '../interfaces';
import { nanoid } from 'nanoid/non-secure';
import { Redirect } from 'react-router-config';

export function flattenRoutes(routes?: IRouteProps[], parent?: IScreen): IScreen[] {
    if (!Array.isArray(routes)) return [];
    const screens: IScreen[] = [];
    for (let idx = 0; idx < routes.length; idx++) {
        const route = routes[idx];
        const { key: routeKey, path, exact, component, strict, redirect, routes: children, ...options } = route;
        const screenKey = routeKey || nanoid();
        const screen: IScreen = {
            key: screenKey,
            name: path || '/',
            component: function ScreenComponent(props) {
                if (redirect) {
                    return <Redirect from={path} to={redirect} exact={exact} strict={strict} />;
                }
                const children = component ? React.createElement(component, props) : null;
                return parent && parent.component ? React.createElement(parent.component, props, children) : children;
            },
            options: {
                ...options,
                routeMatchOpts: route,
            },
        };
        if (Array.isArray(children) && children.length > 0) {
            screens.push(...flattenRoutes(children, screen));
        } else {
            screens.push(screen);
        }
    }
    return screens;
}

