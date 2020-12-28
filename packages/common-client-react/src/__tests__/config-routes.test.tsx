import * as React from 'react';
import * as renderer from 'react-test-renderer';
import * as Loadable from 'react-loadable';
import { Route } from 'react-router-dom';
import { getRoutes } from '../utils';
import { Feature } from '../connector';
import { FeatureWithRouterFactory } from '../router';
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

  let component1 = renderer.create(<LoadableMyComponent prop="foo" />);

  expect(component1.toJSON()).toMatchSnapshot(); // initial
  await waitFor(200);
  expect(component1.toJSON()).toMatchSnapshot(); // loading
  await waitFor(200);
  expect(component1.toJSON()).toMatchSnapshot(); // loaded

  let component2 = renderer.create(<LoadableMyComponent prop="bar" />);

  expect(component2.toJSON()).toMatchSnapshot(); // reload
});

const routerConfig = (namespace = '') => ({
  [namespace + '/a']: {
    component: MyComponent,
  },
  ['/a/1']: {
    component: MyComponent,
  },
  ['/a/:b/1']: {
    component: MyComponent,
  },
  [namespace + '/a/1']: {
    component: MyComponent,
  },
  [namespace + '/a/:c/1']: {
    component: MyComponent,
  },
  [namespace + '/a/2']: {
    component: MyComponent,
  },
  [namespace + '/a/2/1']: {
    component: MyComponent,
  },
  [namespace + '/ab/2/1']: {
    component: MyComponent,
  },
  [namespace + '/b/1']: {
    component: MyComponent,
  },
  [namespace + '/b/login/register']: {
    component: MyComponent,
  },
});

describe('getRoutes utility with basic routes', () => {


  test('with /a', async () => {
    const result = {
      // component: any,
      routes: [{
        path: '/a', exact: true, routes:
          [{ path: '/a/1', exact: true },
          { path: '/a/:b/1', exact: true },
          { path: '/a/2', exact: false, routes: [{ 'exact': true, 'path': '/a/2/1' }] },
          { path: '/ab/2/1', exact: true }],
      }],
    };

    const routes = getRoutes(/^\/a.*/, routerConfig());
    expect(routes).toMatchSnapshot();
  });

  test('with /', async () => {
    const result =
      [{
        path: '/a', exact: false, routes:
          [
            { path: '/a/1', exact: true },
            { path: '/a/:b/1', exact: true },
            { path: '/a/:c/1', exact: true },
            {
              path: '/a/2', exact: false, routes:
                [
                  { path: '/a/2/1', exact: true },
                ],
            },
          ],
      },
      { path: '/ab/2/1', exact: true },
      { path: '/b/1', exact: true },
      { path: '/b/login/register', exact: true }];
    const routes = getRoutes(/^\/.*/, routerConfig());
    expect(routes).toMatchSnapshot();
    expect(JSON.parse(JSON.stringify(routes))).toMatchObject(result);
  });

  test('with `@`in root throws error', async () => {
    try {
      getRoutes(/^\/@namespace.*/, routerConfig('@namespace'));
    } catch (e) {
      expect(e.message).toEqual('Invalid path!');
    }
  });

  xdescribe('getRoutes utility with realistic routes', () => {


    test('with realistic routes', () => {

      const genRoutes = {
        ['/path']: { component: MyComponent, exact: true },
        ['/path/a']: { component: MyComponent },
        ['/path/a/b']: { component: MyComponent },
        ['/path/child']: { component: MyComponent, exact: true },
        ['/path/child1']: { component: MyComponent, exact: true },
      };
      const routes = getRoutes(/^\/.*/, genRoutes);

      const result = [
        {
          // should render
          component: MyComponent,
          path: '/path',
          exact: true,
          routes: [
            {
              // should skip
              component: MyComponent,
              path: '/path/a',
              exact: false,
              routes: [
                {
                  // should skip
                  component: MyComponent,
                  path: '/path/a/b',
                  exact: true,
                },
              ],
            },
            {
              // should skip
              component: MyComponent,
              path: '/path/child',
              exact: true,
            },
            {
              // should render
              path: '/path/child1',
              component: MyComponent,
            },
          ],
        },
      ];

      expect(routes).toMatchObject(result);
      expect(routes).toMatchSnapshot();
    });
    it('another realistic test', () => {

      const genRoutes = [
        {
          ['/ghost']: { component: MyComponent },
          ['/pepper']: { component: MyComponent, exact: false },
          ['/pepper/:type']: { component: MyComponent, exact: false },
          ['/pepper/:type/scoville']: { component: MyComponent, exact: false },
        },
      ];
      const result = [
        {
          path: '/ghost',
          component: MyComponent,
        },
        {
          path: '/pepper',
          component: MyComponent,
          exact: false,
          routes: [
            {
              path: '/pepper/:type',
              component: MyComponent,
              exact: false,
              routes: [
                {
                  path: '/pepper/:type/scoville',
                  component: MyComponent,
                  exact: false,
                },
              ],
            },
          ],
        },
      ];
      const connector = new Feature({ routeConfig: genRoutes });
      const connectorRoutes = connector.getConfiguredRoutes();
      expect(connectorRoutes).toMatchObject(result);
    });
  });

  it('with root', () => {
    const genRoutes = [
      {
        ['/']: { component: MyComponent, exact: false },
        ['/ghost']: { component: MyComponent },
        ['/pepper']: { component: MyComponent, exact: false },
        ['/pepper/:type']: { component: MyComponent, exact: false },
        ['/pepper/:type/scoville']: { component: MyComponent, exact: false },
      },
    ];
    const connector = new Feature({ routeConfig: genRoutes });
    const connectorRoutes = connector.getConfiguredRoutes();
    expect(connectorRoutes).toMatchSnapshot();

  });

});


xdescribe('connector configuredRoutes', () => {

  test('with no arguments passed', async () => {

    const connector = new Feature({ routeConfig: routerConfig() });
    const result = [{
      exact: false, path: '/a',
      routes: [
        { exact: true, path: '/a/1' },
        { path: '/a/:b/1', exact: true },
        { path: '/a/:c/1', exact: true },
        {
          exact: false, path: '/a/2',
          routes: [
            { exact: true, path: '/a/2/1' },
          ],
        }],
    },
    { exact: true, path: '/ab/2/1' },
    { exact: true, path: '/b/1' },
    { exact: true, path: '/b/login/register' }];


    const routes = connector.getConfiguredRoutes();
    expect(routes).toMatchSnapshot();

    expect(JSON.parse(JSON.stringify(routes))).toMatchObject(result);
  });

  test('with @namespace in routes', async () => {

    const connector = new Feature({ routeConfig: routerConfig('@namespace') });
    const result = [
      { exact: true, path: '/a/1' },
      { path: '/a/:b/1', exact: true },
    ];

    expect(JSON.parse(JSON.stringify(connector.getConfiguredRoutes()))).toMatchObject(result);
  });
});


xdescribe('connector getRoutes', () => {
  const staticRoutes = {
    route: [
      <Route key={'static1'} exact={true} path="/static1" component={MyComponent} />,
      <Route key={'static2'} exact={true} path="/static2" component={MyComponent} />,
    ],
  };
  const staticRoutes2 = {
    route: [
      <Route key={'static3'} exact={true} path="/static3" component={MyComponent} />,
      <Route key={'static4'} exact={true} path="/static4" component={MyComponent} />,
    ],
  };

  test('with only static routes', async () => {
    const connector = new Feature(staticRoutes, FeatureWithRouterFactory);

    expect(connector.routerFactory()).toMatchSnapshot();
  });

  test('with static routes and configurable routes', async () => {
    const connector = new Feature({ routeConfig: routerConfig() }, new Feature(staticRoutes));

    expect(connector.getRoutes()).toMatchSnapshot();
  });


  test('with only configurable routes', async () => {
    const connector = new Feature({ routeConfig: routerConfig() });

    expect(connector.getRoutes()).toMatchSnapshot();
  });

  test('with multiple Features', async () => {
    const connector = new Feature(
      { routeConfig: routerConfig() },
      new Feature(staticRoutes),
      new Feature(staticRoutes2),
      { routeConfig: routerConfig('/ac') },
    );

    const routes = connector.getRoutes();
    expect(routes).toMatchSnapshot();
  });




});

xdescribe('filter routes with realizting routes', () => {

  const genRoutes = {
    ['/']: { component: MyComponent, exact: true },
    ['/l']: { component: MyComponent },
    ['/rl']: { component: MyComponent },
    ['/:or/a/b']: { component: MyComponent },
    ['/:or/child']: { component: MyComponent, exact: true },
    ['/:or/child1']: { component: MyComponent, exact: true },
  };
  const result =
    [
      { path: '/', exact: true },
      { path: '/l' },
      { path: '/rl' },
      { path: '/:or/ab/2/1', exact: true },
      { path: '/:or/b/1', exact: true },
      { path: '/:or/b/login/register', exact: true }];

      const connector = new Feature({ routeConfig: genRoutes });
      const regexExpNotStartWithColon = /^\/(?!(:)).*/;
      const connectorRoutes = connector.getConfiguredRoutes(regexExpNotStartWithColon);

      // TODO now need to filter routes which don't start with `/:or`. Something
      // similar to regex, we need to a netgaive `connector.getConfiguredRoutes('^/:or');`
      console.log('---ConnectorRoutes', connectorRoutes);
      // connectorRoutes.
});

