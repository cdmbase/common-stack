import * as React from 'react';
import * as Loadable from 'react-loadable';
import { IRouteData } from '../interfaces';
import { matchRoutes } from 'react-router-config';
import * as _ from 'lodash';
import { ConsoleLogger, IConsoleLoggerSettings } from '@cdm-logger/server';
import { LoggerLevel } from '@cdm-logger/core';
import * as Logger from 'bunyan';
export const logger: Logger = ConsoleLogger.create('test', { level: 'trace' });
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
    // Conversion and stitching parameters.
    let mergedData = {};
    const renderRoutes = routes.map(item => {
        const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
        const routeObject = { ...routerData[`${path}${item}`] };

        if (exact) {
            // split and merge
            // if we receive /a/1/2 it should merge as 
            // { path: '/a', routes: [{ path: '/1', routes: [{ path: '/a/1/2'}]}]}
            const arr = (`${path}${item}`).split('/').filter(x => x);
            console.log(`${path}${item}`)
            arr.map((value, i) => {
                console.log(value);
                let newVal = '';
                let newK = {};

                let newMerge: { path?: string, routes?: any[] } = {};
                for (let st = 0; st <= i; st++) {
                    newVal = newVal.concat(`/${arr[st]}`);
                    if (_.isEmpty(newMerge)) {
                        // creates initial object
                        newMerge = _.merge(newMerge, { path: newVal });
                    } else {
                        // probably > first loop
                        // if (sub) {
                        // newK = _.merge(newK, { addToSub(sub, { path: newVal }) });
                        // newK = _.merge(newK, { addToSub(sub, { path: newVal }) });
                        newK = _.merge(newK, { ...addToSub(newMerge, { path: newVal }) });
                        // } else {
                        //     newK = { path: newVal };
                        // }
                        newMerge = _.merge(newMerge, { ...newK });
                    }

                }
                logger.debug('with [%s] == [%j]', newVal, newMerge);
                mergedData = _.merge(mergedData, {});
            });
        }
        return {
            ...routeObject,
            key: `${path}${item}`,
            path: `${path}${item}`,
            exact,
        };
    });
    return renderRoutes;
}

const addToSub = (sub, val) => {
    logger.debug('addToSub %j => %j', val, sub);
    if (sub && sub.routes) {
        logger.debug('...looping..');
        let c = addToSub({ ...sub.routes[0] }, val);
        logger.debug('merge source %j with %j', sub, c);
        sub = _.merge(sub, { routes: [c] });
    } else {
        logger.debug('expecting no router => %j', sub);
        sub = { ...(sub), routes: [val] };
        logger.debug('moidifed by adding %j => %j', val, sub);
    }

    return sub;
};


