import * as React from 'react';
import * as renderer from 'react-test-renderer';
import * as Loadable from 'react-loadable';
import { Route } from 'react-router-dom';
import { getRoutes } from '../utils';
import { Feature } from '../connector';
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
  } catch (err) {
  }
});

// Test case borrowed from
// https://github.com/jamiebuilds/react-loadable/blob/master/__tests__/test.js
test('loading success', async () => {
  let LoadableMyComponent = Loadable<{ prop: any }, {}>({
    loader: createLoader(400, () => MyComponent),
    loading: MyLoadingComponent,
  });

  let component1 = renderer.create(<LoadableMyComponent prop="foo"/>);

  expect(component1.toJSON()).toMatchSnapshot(); // initial
  await waitFor(200);
  expect(component1.toJSON()).toMatchSnapshot(); // loading
  await waitFor(200);
  expect(component1.toJSON()).toMatchSnapshot(); // loaded

  let component2 = renderer.create(<LoadableMyComponent prop="bar"/>);

  expect(component2.toJSON()).toMatchSnapshot(); // reload
});

const routerConfig = (namespace = '') => ({
  [namespace + '/a']: {
    component: () => MyComponent,
  },
  ['/a/1']: {
    component: () => MyComponent,
  },
  [namespace + '/a/1']: {
    component: () => MyComponent,
  },
  [namespace + '/a/2']: {
    component: () => MyComponent,
  },
  [namespace + '/a/2/1']: {
    component: () => MyComponent,
  },
  [namespace + '/ab/2/1']: {
    component: () => MyComponent,
  },
  [namespace + '/b/1']: {
    component: () => MyComponent,
  },
  [namespace + '/b/login/register']: {
    component: () => MyComponent,
  },
});

describe('routeConfig getRoutes', () => {


  test('getRoutes based on index path', async () => {
    const result = {
      path: '/a',
      exact: false,
      root: true,
      routes:
        [{ path: '/a/1', exact: true, routes: [] },
          { path: '/a/2', exact: false, routes: [{ 'exact': true, 'path': '/a/2/1', 'routes': [] }] },
          { path: '/ab/2/1', exact: true, routes: [] }],
    };

    const routes = getRoutes('/a', routerConfig());
    expect(routes).toMatchSnapshot();
  });

  test('getRoutes based on index path', async () => {
    const result = {
      path: '/',
      exact: false,
      root: true,
      routes:
        [{
          path: '/a', exact: false, routes: [
            {
              exact: true,
              path: '/a/1',
              routes: [],
            },
            {
              exact: false,
              path: '/a/2',
              routes: [
                {
                  exact: true,
                  path: '/a/2/1',
                  routes: [],
                },
              ],
            },
          ],
        },
          { path: '/ab/2/1', exact: true, routes: [] },
          { path: '/b/1', exact: true, routes: [] },
          { path: '/b/login/register', exact: true, routes: [] }],
    };
    const routes = getRoutes('/', routerConfig());
    expect(routes).toMatchSnapshot();
    expect(JSON.parse(JSON.stringify(routes))).toMatchObject(result);
  });

  test('getRoutes with `@`in namespace', async () => {
    try {
      getRoutes('@namespace', routerConfig('@namespace'));
    } catch (e) {
      expect(e.message).toEqual('Invalid path!');
    }
  });
});


describe('connector configuredRoutes', () => {

  test('getRoutes based on index path', async () => {

    const connector = new Feature({ routeConfig: routerConfig() });
    const result = {
      exact: false, path: '/', root: true,
      routes: [{
        exact: false, path: '/a',
        routes: [{ exact: true, path: '/a/1', routes: [] },
          {
            exact: false, path: '/a/2',
            routes: [
              { exact: true, path: '/a/2/1', routes: [] },
            ],
          }],
      },
        { exact: true, path: '/ab/2/1', routes: [] },
        { exact: true, path: '/b/1', routes: [] },
        { exact: true, path: '/b/login/register', routes: [] }],
    };


    const routes = connector.getConfiguredRoutes();
    expect(routes).toMatchSnapshot();

    expect(JSON.parse(JSON.stringify(routes))).toMatchObject(result);
  });

  test('getRoutes based without any namespace', async () => {

    const connector = new Feature({ routeConfig: routerConfig('@namespace') });
    const result = {
      exact: false, path: '/', root: true,
      routes: [{ exact: true, path: '/a/1', routes: [] }],
    };

    expect(JSON.parse(JSON.stringify(connector.getConfiguredRoutes()))).toMatchObject(result);
  });
});


describe('connector routes', () => {
  const staticRoutes = {
    route: [
      <Route key={'static1'} exact={true} path="/static1" component={MyComponent}/>,
      <Route key={'static2'} exact={true} path="/static2" component={MyComponent}/>,
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
