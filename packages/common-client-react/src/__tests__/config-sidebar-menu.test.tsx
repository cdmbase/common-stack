import * as React from 'react';
import * as renderer from 'react-test-renderer';
import * as Loadable from 'react-loadable';
import { Route } from 'react-router-dom';
import { getRoutes } from '../utils';
import { Feature } from '../connector';
import { FeatureWithRouterFactory } from '../router';
import { IMenuData } from '../interfaces';
import { isUrl, getMenus } from '../utils';
import {sortBy} from 'lodash';
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

describe('sort menu by priority', () => {

    const sortMenusByPriority = (menus) => {
        return sortBy(menus, (obj) => parseInt(obj.priority, 10));
    }
    
    const sortMenus = (sortByPriority, menus) => {
        if (sortByPriority) {
            const menuData = sortMenusByPriority(menus);
            return menuData.map(menu => {
                return {
                    children: menu.children && sortMenus(sortByPriority, menu.children),
                    info: menu.info,
                    priority: menu.priority
                }
            });
        } else {
            return menus;
        }
    }

    const input = [
        {
            children: [
                {
                    info: 'aa1',
                    priority: 1
                },
                {
                    info: 'aa3',
                    priority: 3
                },
                {
                    info: 'aa2',
                    priority: 2
                }
            ],
            info: 'aa',
            priority: 2
        },
        {
            children: [
                {
                    info: 'bb1',
                    priority: 1
                },
                {
                    info: 'bb3',
                    priority: 3
                },
                {
                    info: 'bb2',
                    priority: 2
                }
            ],
            info: 'bb',
            priority: 1
        }
    
    ];

    const output = [
        {
            children: [
                {
                    info: 'bb1',
                    priority: 1,
                    children: undefined
                },
                {
                    info: 'bb2',
                    priority: 2,
                    children: undefined
                },
                {
                    info: 'bb3',
                    priority: 3,
                    children: undefined
                }
            ],
            info: 'bb',
            priority: 1
        },
        {
            children: [
                {
                    info: 'aa1',
                    priority: 1,
                    children: undefined
                },
                {
                    info: 'aa2',
                    priority: 2,
                    children: undefined
                },
                {
                    info: 'aa3',
                    priority: 3,
                    children: undefined
                }
            ],
            info: 'aa',
            priority: 2
        }
    ];

    test('test sort menus', () => {
        let sortByPriority = true;
        expect(sortMenus(sortByPriority, input)).toEqual(output);
        sortByPriority = false;
        expect(sortMenus(sortByPriority, input)).toEqual(input);
    });
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
        const connector = new Feature({ menuConfig: [genMenuData()]  } as any);
        const connector2 = new Feature({ menuConfig: [genMenuData('/test')] } as any);

        const feature = new Feature(connector, connector2);
        const finalMenu = feature.getMenus();

        expect(finalMenu).toMatchSnapshot();
    });

});

