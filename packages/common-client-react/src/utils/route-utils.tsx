import * as React from 'react';
import { IRouteData, IMappedData, IMenuData, IMenuItem, IMenuPosition } from '../interfaces';
import { RouteProps, Switch } from 'react-router';
import { Route } from 'react-router-dom';
const sortKeys = require('sort-keys');


/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}
/**
 * Generates Routes based on the key value, where key has the path of the route and value
 * has rest of the values for building a `<Router ../>` component.
 *
 * @param path: RegExp
 * @param routerData
 */
export function getRoutes2(path: RegExp, routerData: IRouteData) {
  const routes = Object.keys(routerData).filter(routePath => {
    return routePath.match(path);
  });
  const mappedRoutes: Array<IMappedData> = routes.map(paths => {
    return {
      route: paths,
      ...routerData[paths],
    };
  });
  const root: RouteProps & { routes?: any } = {
  };
  mappedRoutes.forEach(eachRoute => {
    const children = eachRoute.route.split('/');
    children.shift();

    // if the route is `/` then add this correction.
    if (eachRoute.route === '/') {
      children.shift();
      children.push('/');
    }
    const depth = children.length;
    let lastNode = root;
    for (let i = 0; i <= depth; i++) {
      const lastIndex = (lastNode.routes || []).findIndex(item => {
        if (eachRoute.route.startsWith(item.path)) {
          return eachRoute.route[item.path.length] === '/';
        }
      });
      if (lastIndex === -1) {
        break;
      }
      lastNode = lastNode.routes[lastIndex];
      // do not overwrite the route's exact value
      lastNode.exact = routerData[lastNode.path as string].hasOwnProperty('exact') ? routerData[lastNode.path as string].exact : false;
    }
    if (!lastNode.routes) {
      lastNode.routes = [];
    }
    const modfiedRoute = formatSlash(eachRoute.route);
    lastNode.routes.push({
      ...eachRoute,
      // route: modfiedRoute,
      path: modfiedRoute,
      exact: routerData[eachRoute.route].hasOwnProperty('exact') ? routerData[eachRoute.route].exact : true,
      component: eachRoute.component,
    });
  });

  return root.routes;
}

const startWithMoreThanOneSlash = /^(\/)\1+/; // for exame `//abc, ///abc, ...`
const formatSlash = (route) => {
  // replaced `//` with `/` in the routes.
  return {
    path: route.replace(startWithMoreThanOneSlash, '/'),
    _pathPrefix: (route.match(/^\/(\/{1,})/) || ['', ''])[1],
  }
}

export function getRoutes(path: string, routeData: IRouteData, authWrapper: (ele, props) => void) {
  if (!path.startsWith('/')) {
    throw new Error('Invalid path!');
  }
  let searchPath = path;
  if (path[path.length - 1] !== '/') {
    searchPath = path + '/';
  }
  const routes = Object.keys(routeData).filter(menuPath => {
    return menuPath.indexOf(searchPath) === 0 || menuPath === path;
  });

  const mappedMenuPaths: Array<IMappedData> = routes.map(mPath => {
    return {
      route: mPath,
      position: IMenuPosition.MIDDLE,
      ...routeData[mPath],
    };
  });
  const root: RouteProps & { routes?: any } = {
    // just to satisfy types added following
    // TOOD need to correct types so we don't have to enter them.
    name: 'root',
    position: IMenuPosition.LOGO,
  } as any;
  mappedMenuPaths.forEach(routeItem => {
    const children = routeItem.route.split('/');
    children.shift();

    // if the route is `/` then add this correction.
    if (routeItem.path === '/') {
      children.shift();
      children.push('/');
    }
    const depth = children.length;
    let lastNode = root;
    for (let i = 0; i < depth; i++) {
      const lastIndex = (lastNode.routes || []).findIndex(item => {
        const routePath = `${item._pathPrefix}${item.path}`;

        if (routeItem.route.startsWith(routePath)) {
          return routeItem.route[routePath.length] === '/';
        }
      });
      if (lastIndex === -1) {
        break;
      }
      lastNode = lastNode.routes[lastIndex];
      const lastNodePath = `${(lastNode as any)._pathPrefix}${lastNode.path}`;
      lastNode.exact = routeData[lastNodePath].hasOwnProperty('exact') ? routeData[lastNodePath].exact : false;
    }
    if (!lastNode.routes) {
      lastNode.routes = [];
    }
    const { route: ignore, auth, ...rest } = routeItem;
    const pathParams = formatSlash(routeItem.route);

    lastNode.routes.push({
      ...rest,
      // path: formatSlash(routeItem.route),
      // path: routeItem.route,
      ...pathParams,
      exact: routeData[routeItem.route].hasOwnProperty('exact') ? routeData[routeItem.route].exact : true,
      /**
       * Here we are checking whether auth property is being 
       * set by this route and if authWrapper is declared
       * which is a high order component that can take a component
       * and its props as argument then perform some 
       * computation and return a component
       */
      component: auth && authWrapper
        ? (props) => authWrapper(routeItem.component, props)
        : routeItem.component
    });
  });

  return root.routes;
}

export function getMenus(path: string, menuData: IMenuData) {
  if (!path.startsWith('/')) {
    throw new Error('Invalid path!');
  }
  let searchPath = path;
  if (path[path.length - 1] !== '/') {
    searchPath = path + '/';
  }
  const routes = Object.keys(menuData).filter(menuPath => {
    return menuPath.indexOf(searchPath) === 0 || menuPath === path;
  });

  const mappedMenuPaths: Array<IMenuItem & { route?: string }> = routes.map(mPath => {
    return {
      route: mPath,
      position: IMenuPosition.MIDDLE,
      ...menuData[mPath],
    };
  });
  const root: IMenuItem & { route?: string } = {
    // just to satisfy types added following
    // TOOD need to correct types so we don't have to enter them.
    name: 'root',
    position: IMenuPosition.LOGO,
  };
  mappedMenuPaths.forEach(menutItem => {
    const children = menutItem.route.split('/');
    children.shift();
    const depth = children.length;
    let lastNode = root;
    for (let i = 0; i < depth; i++) {
      const lastIndex = (lastNode.children || []).findIndex(item => {
        if (menutItem.route.startsWith(item.path)) {
          return menutItem.route[item.path.length] === '/';
        }
      });
      if (lastIndex === -1) {
        break;
      }
      lastNode = lastNode.children[lastIndex];
      // do not overwrite the route's exact value
      lastNode.exact = menuData[lastNode.path].hasOwnProperty('exact') ? menuData[lastNode.path].exact : false;
    }
    if (!lastNode.children) {
      lastNode.children = [];
    }
    const { route: ignore, ...rest } = menutItem;
    lastNode.children.push({
      path: menutItem.route,
      ...rest,
      exact: menuData[menutItem.route].hasOwnProperty('exact') ? menuData[menutItem.route].exact : true,
    });
  });

  return root.children;
}


export const renderRoutes = (routes, solidRoutes, extraProps = {}, switchProps = {}) =>
  routes ? (
    <>
      {[
        ...solidRoutes, ...routes.map((route, i) => (
          <Route
            key={route.key || i}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={props =>
              route.render ? (
                route.render({ ...props, ...extraProps, route: route })
              ) : (
                <route.component {...props} {...extraProps} route={route} />
              )
            }
          />
        )),
      ]}
    </>
  ) : null;


export const getSortedRoutes = (path: string, routeData: IRouteData, authWrapper: (
  ele: React.ReactElement,
  props: Record<string, any>
) => void) => {
  const sortedRoutes = sortKeys(routeData, { compare });
  return getRoutes(path, sortedRoutes, authWrapper);
};

const compare = ((a, b) => {
  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();

  // Alphanumeric elements always come before non-alphanumeric elements
  const aIsAlphanumeric = notStartWithColon(aStr);
  const bIsAlphanumeric = notStartWithColon(bStr);
  if (aIsAlphanumeric + bIsAlphanumeric !== -2) {
    if (aIsAlphanumeric * bIsAlphanumeric > 0) {
      if (aIsAlphanumeric === bIsAlphanumeric) {
        return aStr.localeCompare(bStr);
      }
      return aIsAlphanumeric - bIsAlphanumeric;
    }
    if (aIsAlphanumeric > 0) {
      return -1;
    } else if (bIsAlphanumeric > 0) {
      return 1;
    }
  }

  // Numerical elements always come before alphabetic elements
  const aNum = Number(a);
  const bNum = Number(b);
  // If both are numerical, sort in the usual fashion (smaller goes first)
  if (aNum && bNum) {
    return aNum - bNum;
    // If a is numerical but b isn't, put a first.
  } else if (aNum) {
    return -1;
    // If b is numerical but a isn't, put b first.
  } else if (bNum) {
    return 1;
  }

  // In all other cases, default to usual sort order.
  return aStr.localeCompare(bStr);
});


function notStartWithColon(str) {
  const match = (str.match(/^[\/, *, :]{1,}/) || [-1])[0];
  if (match === -1) {
    return -1;
  }
  var i = match.length;
  let count = 0;
  while (i--) {
    const char = match[i];
    if (char === '/') {
      count = count + 3;
    } else if (char === ':') {
      count = count + 1;
    } else if (char === '*') {
      count = count + 2;
    }
  }
  return count;
}