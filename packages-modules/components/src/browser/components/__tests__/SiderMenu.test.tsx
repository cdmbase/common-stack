import * as React from 'react';
import { urlToList } from '../../utils';
import SiderMenu, { getFlatMenuKeys, getMenuMatchKeys, ISiderMenu } from '../SiderMenu';
import { Feature } from '@common-stack/client-react';
import * as ReactDOMServer from 'react-dom/server';
import StaticRouter from 'react-router/StaticRouter';
import 'jest';

const genMenu = {
    ['/dashboard']: {},
    ['/dashboard/name']: {},
    ['/userinfo']: {},
    ['/userinfo/:id']: {},
    ['/userinfo/:id/info']: {},
};


const connector = new Feature({ menuConfig: genMenu });
const menu = connector.getMenus();

const flatMenuKeys = getFlatMenuKeys(menu);


describe('test convert nested menu to flat menu', () => {
    it('simple menu', () => {

        expect(flatMenuKeys).toEqual([
            '/dashboard',
            '/dashboard/name',
            '/userinfo',
            '/userinfo/:id',
            '/userinfo/:id/info',
        ]);
    });
});

describe('test menu match', () => {
    it('simple path', () => {
        expect(getMenuMatchKeys(flatMenuKeys, urlToList('/dashboard'))).toEqual(['/dashboard']);
    });

    it('error path', () => {
        expect(getMenuMatchKeys(flatMenuKeys, urlToList('/dashboardname'))).toEqual([]);
    });

    it('Secondary path', () => {
        expect(getMenuMatchKeys(flatMenuKeys, urlToList('/dashboard/name'))).toEqual([
            '/dashboard',
            '/dashboard/name',
        ]);
    });

    it('Parameter path', () => {
        expect(getMenuMatchKeys(flatMenuKeys, urlToList('/userinfo/2144'))).toEqual([
            '/userinfo',
            '/userinfo/:id',
        ]);
    });

    it('three parameter path', () => {
        expect(getMenuMatchKeys(flatMenuKeys, urlToList('/userinfo/2144/info'))).toEqual([
            '/userinfo',
            '/userinfo/:id',
            '/userinfo/:id/info',
        ]);
    });


});

describe('test component', () => {


    it('sidermenu', () => {

        const pathname = '/dashboard';
        const component = ReactDOMServer.renderToString(
            <StaticRouter location={pathname} context={{}}>
                <SiderMenu
                    menuData={menu}
                    isMobile={false}
                    location={{ pathname } as any}
                    styles={{ sider: '' }}
                />
            </StaticRouter>,
        );

        expect(component).toMatchSnapshot();

    });
});

