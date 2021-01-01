
import { getRoutes } from '../utils';
const sortKeys = require('sort-keys');
import { renderRoutes } from '../route/render-routes';
import 'jest';

function MyComponent(props) {
    return <div>MyComponent {JSON.stringify(props)}</div>;
}

const routerConfig1 = {
    ['/']: {
        exact: false,
        component: MyComponent
    },
    ['//']: {
        exact: true,
        component: MyComponent
    },
    ['//a']: {
        component: MyComponent,
    },
    ['/a/1']: {
        component: MyComponent,
    },
    ['/a/:b']: {
        component: MyComponent,
    },
    ['/a/:b/1']: {
        component: MyComponent,
    },
    ['/a/:b/c']: {
        exact: true,
        component: MyComponent,
    },
    ['/a/:b/c/1']: {
        component: MyComponent,
    },
    ['/a/:c/1']: {
        component: MyComponent,
    },
    ['/a/2']: {
        component: MyComponent,
    },
    ['/a/2/1']: {
        component: MyComponent,
    },
    ['/ab/2/1']: {
        component: MyComponent,
    },
    ['/b/1']: {
        component: MyComponent,
    },
    ['/b/login/register']: {
        component: MyComponent,
    },
};
const routerConfig = {
    ["/login"]: { exact: true, component: MyComponent },
    ["/callback"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/logout"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/profile"]: { exact: true, component: MyComponent },
    ["/authenticate-popup"]: { exact: true, component: MyComponent },
    ["/reset-password"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/account/"]: { exact: false, component: MyComponent },
    ["/:orgName/usermenu/billing"]: { exact: false, component: MyComponent },
    ["/"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/account"]: { exact: false, component: MyComponent },
    ["/:orgName/usermenu/account-settings"]: { exact: true, component: MyComponent },
    ["/:orgName/teams/view/:teamName"]: { exact: false, component: MyComponent },
    ["/:orgName/teams"]: { exact: true, component: MyComponent },
    ["/:orgName/invitation"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/organizations"]: { exact: true, component: MyComponent },
    ["/:orgName/usermenu/switch-organization"]: { exact: true, component: MyComponent },
    ["/:orgName/pref"]: { exact: false, component: MyComponent },
    ["/:orgName/members"]: { exact: false, component: MyComponent },
    ["/:orgName/dashboard"]: { exact: true, component: MyComponent },
    ["/:orgName/registries"]: { exact: true, component: MyComponent },
    ["/:orgName/create-workspace"]: { exact: true, component: MyComponent },
    ["/:orgName/workspace/:id/details"]: { exact: true, component: MyComponent },
    ["/:orgName/workspace/:id/editor"]: { exact: true, component: MyComponent },
    ["/:orgName/workspace/:id"]: { exact: true, component: undefined },
    ["/:orgName/repository"]: { exact: true, component: MyComponent },
    ["/:orgName/artifact"]: { exact: false, component: MyComponent },
    ["/:orgName"]: { exact: false, component: MyComponent },
}

const compare = ((a, b) => {
    const aStr = String(a).toLowerCase();
    const bStr = String(b).toLowerCase();

    // Alphanumeric elements always come before non-alphanumeric elements
    const aIsAlphanumeric = notStartWithColon(aStr);
    const bIsAlphanumeric = notStartWithColon(bStr);
    console.log('aIsAlphanumeric, bIsAlphanumeric',aIsAlphanumeric, bIsAlphanumeric)
    if (aIsAlphanumeric && !bIsAlphanumeric) {
        return -1;
    } else if (bIsAlphanumeric && !aIsAlphanumeric) {
        return 1;
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
    return !str.match(/^\/:.*/);
}

describe('new getRoutes utility with basic routes', () => {


    xtest('with /a', async () => {
        const result = {
            // component: any,
            routes: [{
                path: '/a', routes:
                    [{ path: '/a/1', exact: true },
                    { path: '/a/:b/1', exact: true },
                    { path: '/a/2', routes: [{ 'exact': true, 'path': '/a/2/1' }] },
                    { path: '/ab/2/1', exact: true }],
            }],
        };
        const routes1 = getRoutes(/^\/.*/, sortKeys(routerConfig1));
        // const routes = getRoutes(/^\/.*/, sortKeys(routerConfig, { compare }));
        expect(routes1).toMatchSnapshot();
        // expect(routes).toMatchSnapshot();

        


    });

    test('with org', async () => {

        const routes1 = getRoutes(/^\/.*/, sortKeys(routerConfig1));
        const renderedRoutes = renderRoutes({
            routes: routes1,

        });

        expect(renderedRoutes).toMatchSnapshot();


    });

});
