import * as React from 'react';
import { IRouteData, IMappedData, IMenuData, IMenuItem, IMenuPosition } from '../interfaces';
import { RouteProps } from 'react-router';
import {Route} from 'react-router-dom';


/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}
/**
 * Generates Routes based on the key value, where key has the path of the route and value
 * has rest of the values for building a `<Router ../>` component.
 *
 * @param path
 * @param routerData
 */
export function getRoutes(path: string, routerData: IRouteData) {
  if (!path.startsWith('/')) {
    throw new Error('Invalid path!');
  }
  let searchPath = path;
  if (path[path.length - 1] !== '/') {
    searchPath = path + '/';
  }
  // console.log(searchPath);

  const routes = Object.keys(routerData).filter(routePath => {
    return routePath.indexOf(searchPath) === 0 || routePath === path;
  });
  const mappedRoutes: Array<IMappedData> = routes.map(paths => {
    return {
      route: paths,
      ...routerData[paths],
    };
  });
  // console.log('mappedRoutes', mappedRoutes);
  const root: RouteProps & { routes?: any } = {
  };
  mappedRoutes.forEach(eachRoute => {
    const children = eachRoute.route.split('/');
    children.shift();
    // children.shift();
    if (eachRoute.route === '/') {
      children.shift();
      children.push('/');
    }
    // console.log('children', children);
    const depth = children.length;
    let lastNode = root;
    for (let i = 0; i < depth; i++) {
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
    lastNode.routes.push({
      path: eachRoute.route,
      exact: routerData[eachRoute.route].hasOwnProperty('exact') ? routerData[eachRoute.route].exact : true,
      component: eachRoute.component,
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
                    render={props => (
                        <route.component {...props} {...extraProps} route={route}/>
                    )}
                />
            )),
          ]}
        </>
    ) : null;
