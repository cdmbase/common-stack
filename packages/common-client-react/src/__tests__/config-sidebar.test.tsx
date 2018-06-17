import * as React from 'react';
import * as renderer from 'react-test-renderer';
import * as Loadable from 'react-loadable';
import { Route } from 'react-router-dom';
import { getRoutes } from '../utils';
import { Feature } from '../connector';
import { FeatureWithRouterFactory } from '../router';
import { IMenuData } from '../interfaces';
import { isUrl, getMenus } from '../utils';
import 'jest';





const genMenuData: (namespace?: string) => IMenuData = (namespace = '') => ({
    [namespace + '/a']: { name: 'a', icon: 'a', authority: 'guest' },
    [namespace + '/a/1']: { name: '1', icon: '1' },
    [namespace + '/a/m']: { name: 'm', icon: 'm' },
    [namespace + '/b/b1']: { name: 'b1', icon: 'b1' },
    ['/b/b2']: { name: 'b2', icon: 'b2' },
    ['/a/m/a1']: { name: 'a1', icon: 'a1', category: 'middle' },
    [namespace + '/a/m/a2']: { name: 'a2', icon: 'a2', category: 'top' },
});

describe('getMenu utility with basic paths', () => {


    function formatter(data, parentAuthority = undefined) {
        return data.map(item => {
            let { path } = item;
            const result = {
                ...item,
                path,
                authority: item.authority || parentAuthority,
            };
            if (item.children) {
                result.children = formatter(item.children, item.authority || parentAuthority);
            }
            return result;
        });
    }

    function getFlatMenuData(menus) {
        let keys = {};
        menus.forEach(item => {
            if (item.children) {
                keys[item.path] = { ...item };
                keys = { ...keys, ...getFlatMenuData(item.children) };
            } else {
                keys[item.path] = { ...item };
            }
        });
        return keys;
    }

    test('with /a', () => {
        const data = getMenus('/', genMenuData());
        const formattedData = formatter(data);
        expect(data).toMatchSnapshot();
        expect(formattedData).toMatchSnapshot();

        expect(getFlatMenuData(formattedData)).toMatchSnapshot();
    });


    test('with given menu', () => {
        const genDashboardMenu = {
            ['/dashboard']: {},
            ['/dashboard/name']: {},
            ['/userinfo']: {},
            ['/userinfo/:id']: {},
            ['/userinfo/:id/info']: {},
        };
        const menu = [
            {
                path: '/dashboard',
                children: [
                    {
                        path: '/dashboard/name',
                    },
                ],
            },
            {
                path: '/userinfo',
                children: [
                    {
                        path: '/userinfo/:id',
                        children: [
                            {
                                path: '/userinfo/:id/info',
                            },
                        ],
                    },
                ],
            },
        ];

        const data = getMenus('/', genDashboardMenu as any);

        expect(data).toMatchObject(menu);

    });
});


describe('getMenu utility with connector', () => {
    it('with connector', () => {
        const connector = new Feature({ menuConfig: [genMenuData()]  });
        const connector2 = new Feature({ menuConfig: [genMenuData('/test')]  });

        const feature = new Feature(connector, connector2);
        const finalMenu = feature.getMenus();

        expect(finalMenu).toMatchSnapshot();
    });

});

