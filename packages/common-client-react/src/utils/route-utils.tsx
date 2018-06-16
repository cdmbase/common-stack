import * as React from 'react';
import { IRouteData, IMappedData } from '../interfaces';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { Route } from 'react-router';

/**
 * @param path
 * @param routerData
 */
export function getRoutes(path: string, routerData: IRouteData) {
  // console.log('lookin ', routerData);
  if (!path.startsWith('/')) {
    throw new Error('Invalid path!');
  }
  let searchPath = path;
  if (path[path.length - 1] !== '/') {
    searchPath = path + '/';
  }
  // console.log('searchPath', searchPath);
  const routes = Object.keys(routerData).filter(routePath => {
    return routePath.indexOf(searchPath) === 0 || routePath === path;
  });
  // console.log('reoutes to check', routes);
  const mappedRoutes: Array<IMappedData> = routes.map(paths => {
    return {
      route: paths,
      ...routerData[paths],
    };
  });
  // console.log('mappedRoutes', mappedRoutes);
  const root: Route = {
  };
  mappedRoutes.forEach(eachRoute => {
    const children = eachRoute.route.split('/');
    children.shift();
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
      lastNode.exact = routerData[lastNode.path].hasOwnProperty('exact') ? routerData[lastNode.path].exact : false;
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


