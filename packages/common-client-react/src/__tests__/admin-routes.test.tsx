import * as React from 'react';
import { getSortedRoutes, renderRoutes, getMenus } from '../utils';



function MyComponent(props) {
    return <div>MyComponent {JSON.stringify(props)}</div>;
}

const routerConfig1 = {
    ['/']: {
        exact: false,
        component: MyComponent,
        name: 'rootSlash',
    },
    ['//']: {
        exact: true,
        component: MyComponent,
        name: 'doubleShlash'
    },
    ['//a']: {
        component: MyComponent,
        name: 'doubleSlashA'
    },
    ['//a/1']: {
        component: MyComponent,
        name: 'doubleShlashA1'

    },
    ['//a/:b']: {
        component: MyComponent,
        name: 'doubleShlashAB'

    },
    ['//a/:b/1']: {
        component: MyComponent,
        name: 'doubleShlashAB1'

    },
    ['//a/:b/c']: {
        exact: true,
        component: MyComponent,
        name: 'doubleShlashABC'

    },
    ['//a/:b/c/1']: {
        component: MyComponent,
        name: 'doubleShlashABC1'

    },
    ['//a/:c/1']: {
        component: MyComponent,
        name: 'doubleShlashAC1'

    },
    ['/a/2']: {
        component: MyComponent,
        name: 'doubleShlashA2'

    },
    ['/a/2/1']: {
        component: MyComponent,
        name: 'doubleShlashA21'

    },
    ['/ab/2/1']: {
        component: MyComponent,
        name: 'doubleShlashAB21'

    },
    ['/b/1']: {
        component: MyComponent,
        name: 'doubleShlash21'

    },
    ['/b/login/register']: {
        component: MyComponent,
        name: 'doubleShlashBLogin'

    },
};
const orgRoutes = {
    ["/login"]: { exact: true, component: MyComponent },
    ["/callback"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/logout"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/profile"]: { exact: true, component: MyComponent },
    ["/authenticate-popup"]: { exact: true, component: MyComponent },
    ["/reset-password"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/account/"]: { exact: false, component: MyComponent },
    ["/:orgName/usermenu/billing"]: { exact: false, component: MyComponent },
    ["/"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/account"]: { exact: false, component: MyComponent },
    ["/:orgName/usermenu/account-settings"]: { exact: true, component: MyComponent },
    ["/:orgName/teams/view/:teamName"]: { exact: false, component: MyComponent },
    ["/:orgName/teams"]: { exact: true, component: MyComponent },
    ["/:orgName/invitation"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/organizations"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/switch-organization"]: { exact: true, component: MyComponent },
    ["/:orgName/pref"]: { exact: false, component: MyComponent },
    ["/:orgName/members"]: { exact: false, component: MyComponent },
    ["/:orgName/dashboard"]: { exact: true, component: MyComponent },
    ["/:orgName/registries"]: { exact: true, component: MyComponent },
    ["/:orgName/create-workspace"]: { exact: true, component: MyComponent },
    ["/:orgName/workspace/:id/details"]: { exact: true, component: MyComponent },
    ["/:orgName/workspace/:id/editor"]: { exact: true, component: MyComponent },
    ["/:orgName/workspace/:id"]: { exact: true, component: undefined },
    ["/:orgName/repository"]: { exact: true, component: MyComponent },
    ["/:orgName/artifact"]: { exact: false, component: MyComponent },
    ["/:orgName"]: { exact: false, component: MyComponent },
};

const layoutRoutes = {
    ['/']: {
        exact: false,
        component: MyComponent,
        name: 'rootSlash',
    },
    ["/:test"]: { exact: true, component: MyComponent },
    ["//home"]: { exact: true, component: MyComponent },
    ["/callback"]: { exact: true, component: MyComponent },
    ["//:orgName/usermenu/logout"]: { exact: true, component: MyComponent },
    ["//:orgName/usermenu/profile"]: { exact: true, component: MyComponent },
    ["/authenticate-popup"]: { exact: true, component: MyComponent },
    ["/reset-password"]: { exact: true, component: MyComponent },
    ["//:orgName/usermenu/account/"]: { exact: false, component: MyComponent },
    ["//:orgName/usermenu/billing"]: { exact: false, component: MyComponent },
    ["//"]: { exact: false, component: MyComponent },
    ["//:orgName/usermenu/account"]: { exact: false, component: MyComponent },
    ["//:orgName/usermenu/account-settings"]: { exact: true, component: MyComponent },
    ["//:orgName/teams/view/:teamName"]: { exact: false, component: MyComponent },
    ["//:orgName/teams"]: { exact: true, component: MyComponent },
    ["//:orgName/invitation"]: { exact: true, component: MyComponent },
    ["//:orgName/usermenu/organizations"]: { exact: true, component: MyComponent },
    ["//:orgName/usermenu/switch-organization"]: { exact: true, component: MyComponent },
    ["//:orgName/pref"]: { exact: false, component: MyComponent },
    ["//:orgName/members"]: { exact: false, component: MyComponent },
    ["//:orgName/dashboard"]: { exact: true, component: MyComponent },
    ["//:orgName/registries"]: { exact: true, component: MyComponent },
    ["//:orgName/create-workspace"]: { exact: true, component: MyComponent },
    ["//:orgName/workspace/:id/details"]: { exact: true, component: MyComponent },
    ["//:orgName/workspace/:id/editor"]: { exact: true, component: MyComponent },
    ["//:orgName/workspace/:id"]: { exact: true, component: undefined },
    // ["//:orgName/repository"]: { exact: true, component: MyComponent },
    // ["//:orgName/artifact"]: { exact: false, component: MyComponent },
    // ["/:orgName"]: { exact: false, component: MyComponent },
};

describe('getRoutes utility with basic routes', () => {


    xtest('with /a', async () => {
        const result = {
            // component: any,
            routes: [{
                path: '/a', routes:
                    [{ path: '/a/1', exact: true },
                    { path: '/a/:b/1', exact: true },
                    { path: '/a/2', routes: [{ 'exact': true, 'path': '/a/2/1' }] },
                    { path: '/ab/2/1', exact: true }],
            }],
        };
        const routes1 = getSortedRoutes('/', routerConfig1);
        // const routes = getRoutes(/^\/.*/, sortKeys(routerConfig, { compare }));
        const menu1 = getMenus('/', routes1);
        expect(routes1).toMatchSnapshot();
        // expect(menu1).toMatchSnapshot();
        // expect(routes).toMatchSnapshot();

    });

    xtest('more url testing', () => {
        const routes = getSortedRoutes('/', orgRoutes);
        expect(routes).toMatchSnapshot();

    })

    test('layout routes', () => {
        const routes = getSortedRoutes('/', layoutRoutes);
        expect(routes).toMatchSnapshot();
    });

    xtest('render /a', async () => {
        const routes1 = getSortedRoutes('/', routerConfig1);
        const renderedRoutes = renderRoutes(routes1, []);
        expect(renderedRoutes).toMatchSnapshot();
    })

});
