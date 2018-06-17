export const menuData = [
    {
        name: 'dashboard',
        icon: 'dashboard',
        path: 'dashboard',
        children: [
            { name: 'analysis', path: 'analysis' },
            { name: 'monitor', path: 'monitor' },
            { name: 'workplace' },
        ],
    },
    {
        name: 'form',
        icon: 'form',
        path: 'form',
        children: [
            { name: 'basic-form', path: 'basic-form' },
            { name: 'step-form', path: 'step-form' },
            { name: 'admin', authority: 'admin' },
        ],
    }, {
        name: 'table',
        icon: 'table',
        path: 'list',
        children: [
            { name: 'table-list', path: 'table-list' },
            { name: 'basic-list', path: 'basic-list' },
            { name: 'card-list', path: 'card-list' },
            {
                name: 'search',
                children: [
                    { name: 'articles', path: 'articles' },
                    { name: 'projects', path: 'projects' },
                    { name: 'applications', path: 'applications' },
                ],
            },
        ],
    }, {
        name: 'profile',
        icon: 'profile',
        path: 'profile',
        children: [
            { name: 'basic' },
            { name: 'advanced', authority: 'admin' },
        ],
    }, {
        name: 'check-circle-o',
        path: 'result',
        children: [
            { name: 'success', path: 'success' },
            { name: 'fail', path: 'fail' },
        ],
    }, {
        name: 'warning',
        path: 'exception',
        children: [
            { name: '403', path: '403' },
            { name: '404', path: '404' },
            { name: '500', path: '500' },
            { name: 'trigger', path: 'trigger', hideInMenu: true },
        ],
    },
    {
        name: 'user',
        icon: 'user',
        path: 'user',
        authority: 'guest',
        children: [
            { name: 'login', path: 'login' },
            { name: 'register', path: 'register' },
            { name: 'register-result', path: 'register-result' },
        ],
    },
];
