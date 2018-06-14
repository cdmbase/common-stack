import * as React from 'react';
import { IRouteData, IMappedData } from '../interfaces';
import { matchRoutes, renderRoutes } from 'react-router-config';


/**
 * @param path
 * @param routerData
 */
export function getRoutes(path: string, routerData: IRouteData) {
  if (!path.startsWith('/')) {
    throw new Error('Invalid path!');
  }
  const routes = Object.keys(routerData).filter(routePath => {
    return routePath.indexOf(path) === 0 && routePath !== path;
  });
  const mappedRoutes: Array<IMappedData> = routes.map(paths => {
    return {
      route: paths,
      component: routerData[paths].component(),
    };
  });
  const root = {
    path,
    exact: false,
    root: true,
    routes: [],
  };
  if (path.length !== 1) {
    routes.forEach(route => {
      route.replace(path, '');
    });
  }
  mappedRoutes.forEach(eachRoute => {
    const children = eachRoute.route.split('/');
    children.shift();
    const depth = children.length;
    let lastNode = root;
    for (let i = 0; i < depth; i++) {
      const lastIndex = lastNode.routes.findIndex(item => {
        if (eachRoute.route.startsWith(item.path)) {
          return eachRoute.route[item.path.length] === '/';
        }
      });
      if (lastIndex === -1) {
        break;
      }
      lastNode = lastNode.routes[lastIndex];
      lastNode.exact = false;
    }
    lastNode.routes.push({
      path: eachRoute.route,
      exact: routerData[eachRoute.route].hasOwnProperty('exact') ? routerData[eachRoute.route].exact : true,
      component: eachRoute.component,
      routes: [],
    });
  });
  return root;
}


