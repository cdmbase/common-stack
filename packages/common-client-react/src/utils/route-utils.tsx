import * as React from 'react';
import * as Loadable from 'react-loadable';
import { IRouteData } from '../interfaces';

export const dynamicWrapper = (component: () => any, loading?: any) => Loadable({
    loader: component,
    loading: loading || <div> Loading...</div>,
});




export function getRelation(str1: string, str2: string) {
    if (str1 === str2) {
        console.warn('Two paths are equal');
    }
    const arr1 = str1.split('/');
    const arr2 = str2.split('/');
    if (arr2.every((item, index) => item === arr1[index])) {
        return 1;
    } else if (arr1.every((item, index) => item === arr2[index])) {
        return 2;
    }
    return 3;
}

export function getRenderArr(routes: string[]) {
    let renderArr = [];
    renderArr.push(routes[0]);
    for (let i = 1; i < routes.length; i += 1) {
        let isAdd = false;
        isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
        renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
        if (isAdd) {
            renderArr.push(routes[i]);
        }
    }
    return renderArr;
}

/**
 * Provides the routes based on the index search path.
 * For example, for routerData = {
 * ['/a']: {},
 * ['/a/1]: {},
 * ['/a/2]: {},
 * ['/a/2/1]: {},
 * ['/b/1]: {},
 * ['/b/2]: {},
 * ['/ab/1]: {},
 * }
 *
 * result of getRoutes('/a', routerData) will be
 * [
 * {path: '/a/1', ...},
 * {path: '/a/2', ...},
 * ]
 *
 *
 * @param path
 * @param routerData
 */
export function getRoutes(path: string, routerData: IRouteData) {
    if (path[path.length - 1] !== '/') {
        path += '/'; //  Add a '/' to exclude incomplete paths
    }
    let routes = Object.keys(routerData).filter(routePath => {
        return routePath.indexOf(path) === 0 && routePath !== path;
    });
    // Replace path to '' eg. path='user' /user/name => name.
    routes = routes.map(item => item.replace(path, ''));
    // Get the route to be rendered to remove the deep rendering.
    // const renderArr = getRenderArr(routes);
    // Conversion and stitching parameters.
    const renderRoutes = routes.map(item => {
        const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
        const routeObject = { ...routerData[`${path}${item}`] };
        return {
            ...routeObject,
            key: `${path}${item}`,
            path: `${path}${item}`,
            // component: dynamicWrapper(routeObject.component, routeObject.loading),
            exact,
        };
    });
    return renderRoutes;
}
