import * as React from 'react';
import * as renderer from 'react-test-renderer';
import * as Loadable from 'react-loadable';
import { Route } from 'react-router-dom';
import { getRoutes } from '../utils';
import { Feature } from '../connector';
import { IRouteData } from '../interfaces';
import 'jest';

function waitFor(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
}

function createLoader(delay, loader, error?: any) {
    return () => {
        return waitFor(delay).then(() => {
            if (loader) {
                return loader();
            } else {
                throw error;
            }
        });
    };
}

function MyLoadingComponent(props) {
    return <div>MyLoadingComponent {JSON.stringify(props)}</div>;
}

function MyComponent(props) {
    return <div>MyComponent {JSON.stringify(props)}</div>;
}

afterEach(async () => {
    try {
        await Loadable.preloadAll();
    } catch (err) { }
});

// Test case borrowed from
// https://github.com/jamiebuilds/react-loadable/blob/master/__tests__/test.js
test('loading success', async () => {
    let LoadableMyComponent = Loadable<{ prop: any }, {}>({
        loader: createLoader(400, () => MyComponent),
        loading: MyLoadingComponent,
    });

    let component1 = renderer.create(<LoadableMyComponent prop="foo" />);

    expect(component1.toJSON()).toMatchSnapshot(); // initial
    await waitFor(200);
    expect(component1.toJSON()).toMatchSnapshot(); // loading
    await waitFor(200);
    expect(component1.toJSON()).toMatchSnapshot(); // loaded

    let component2 = renderer.create(<LoadableMyComponent prop="bar" />);

    expect(component2.toJSON()).toMatchSnapshot(); // reload
});

const routerConfig = (namespace = '') => ([{
    component: () => MyComponent,
    routes: [{
            path: namespace + '/a',
            exact: true,
            component: MyComponent,
            routes: [{
                    path: namespace + '/a/1',
                    exact: true,
                    component: MyComponent,
                },
                {
                    path: namespace + '/a/2',
                    exact: true,
                    component: MyComponent,
                    routes: [{
                        path: namespace + '/a/2/1',
                        exact: true,
                        component: MyComponent,
                    }],
                },
            ],
        },
        {
            path: namespace + '/ab/2/1',
            exact: true,
            component: MyComponent,
        },
        {
            path: namespace + '/ab/2/1',
            exact: true,
            component: MyComponent,
        },
        {
            path: namespace + '/b/1',
            exact: true,
            component: MyComponent,
        },
        {
            path: namespace + '/b/login/register',
            exact: true,
            component: MyComponent,
        },
    ],
}]);

describe('routeConfig getRoutes', () => {
    test('getRoutes based on index path', async () => {
        const result = ['/a/1', '/a/2', '/a/2/1'];
        const branch = getRoutes('/a', routerConfig());

        expect(branch.length).toEqual(2);

        // Check individually at various index positions if the route matches. There aren't any other way really.
        // This is also part of the recommended way react-route matchRoutes follows
        // https://github.com/ReactTraining/react-router/blob/master/packages/react-router-config/modules/__tests__/matchRoutes-test.js#L66

        // react-router matches root path as well. Can skip this match.
        expect(branch[0].match).toEqual(expect.objectContaining({path: '/'}));
        // Confirming required paths.
        expect(branch[1].route.routes[0]).toEqual(expect.objectContaining({path: result[0]}));
        expect(branch[1].route.routes[1]).toEqual(expect.objectContaining({path: result[1]}));
        expect(branch[1].route.routes[1].routes[0]).toEqual(expect.objectContaining({path: result[2]}));
    });

    test('getRoutes based on index path', async () => {
        const result = ['/a', '/a/1', '/a/2', '/a/2/1', '/ab/2/1', '/b/1', '/b/login/register'];
        const branch = getRoutes('', routerConfig());
        // expect().map(item => item.path)).toEqual(result);

        expect(branch.length).toEqual(1);

        expect(branch[0].route.routes[0]).toEqual(expect.objectContaining({path: '/a'}));
        expect(branch[0].route.routes[0].routes[0]).toEqual(expect.objectContaining({path: '/a/1'}));
        expect(branch[0].route.routes[0].routes[1]).toEqual(expect.objectContaining({path: '/a/2'}));
        expect(branch[0].route.routes[0].routes[1].routes[0]).toEqual(expect.objectContaining({path: '/a/2/1'}));
        expect(branch[0].route.routes[1]).toEqual(expect.objectContaining({path: '/ab/2/1'}));
        expect(branch[0].route.routes[3]).toEqual(expect.objectContaining({path: '/b/1'}));
        expect(branch[0].route.routes[4]).toEqual(expect.objectContaining({path: '/b/login/register'}));
    });

    test('getRoutes with `@`in namespace', async () => {
        const result = ['@namespace/a', '@namespace/a/1',
              '@namespace/a/2', '@namespace/a/2/1', '@namespace/ab/2/1', '@namespace/b/1', '@namespace/b/login/register'];
        const branch = getRoutes('@namespace', routerConfig('@namespace'));

        expect(branch.length).toEqual(1);

        expect(branch[0].route.routes[0]).toEqual(expect.objectContaining({path: '@namespace/a'}));
        expect(branch[0].route.routes[0].routes[0]).toEqual(expect.objectContaining({path: '@namespace/a/1'}));
        expect(branch[0].route.routes[0].routes[1]).toEqual(expect.objectContaining({path: '@namespace/a/2'}));
        expect(branch[0].route.routes[0].routes[1].routes[0]).toEqual(expect.objectContaining({path: '@namespace/a/2/1'}));
        expect(branch[0].route.routes[1]).toEqual(expect.objectContaining({path: '@namespace/ab/2/1'}));
        expect(branch[0].route.routes[3]).toEqual(expect.objectContaining({path: '@namespace/b/1'}));
        expect(branch[0].route.routes[4]).toEqual(expect.objectContaining({path: '@namespace/b/login/register'}));
    });
});

describe('connector configuredRoutes', () => {

    test('getRoutes based on index path', async () => {
        const connector = new Feature({ routeConfig: routerConfig() });
        const result = [
             { path: '/a', exact: true },
             { path: '/a/1', exact: true },
             { path: '/a/2', exact: true },
             { path: '/a/2/1', exact: true },
             { path: '/ab/2/1', exact: true },
             { path: '/b/1', exact: true },
             { path: '/b/login/register', exact: true },
        ];

        expect(connector.configuredRoutes[0].route.routes[0]).toMatchObject(result[0]);
        expect(connector.configuredRoutes[0].route.routes[0].routes[0]).toMatchObject(result[1]);
        expect(connector.configuredRoutes[0].route.routes[0].routes[1]).toMatchObject(result[2]);
        expect(connector.configuredRoutes[0].route.routes[0].routes[1].routes[0]).toMatchObject(result[3]);
        expect(connector.configuredRoutes[0].route.routes[1]).toMatchObject(result[4]);
        expect(connector.configuredRoutes[0].route.routes[3]).toMatchObject(result[5]);
        expect(connector.configuredRoutes[0].route.routes[4]).toMatchObject(result[6]);
    });

    test('getRoutes based without any namespace', async () => {

        const connector = new Feature({ routeConfig: routerConfig('@namespace') });
        const result = [{ 'exact': true, 'path': '@namespace/a/1' }];

        expect(connector.configuredRoutes[0].route.routes[0].routes[0]).toMatchObject(result[0]);
    });
});

describe('connector routes', () => {
    const staticRoutes = {
        route: [
            <Route key={'static1'} exact={true} path="/static1" component={MyComponent} />,
            <Route key={'static2'} exact={true} path="/static2" component={MyComponent} />,
        ],
    };

    test('check static routes', async () => {
        const connector = new Feature(staticRoutes);

        expect(connector.routes).toMatchSnapshot();
    });

    test('merge static routes and configurable routes', async () => {
        const connector = new Feature({ routeConfig: routerConfig() }, new Feature(staticRoutes));

        expect(connector.routes).toMatchSnapshot();
    });


    test('check configurable routes', async () => {
        const connector = new Feature({ routeConfig: routerConfig() });

        expect(connector.routes).toMatchSnapshot();
    });
});
