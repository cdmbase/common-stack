import * as React from 'react';
import 'jest';
import { getRoutes } from '../utils';
import { ConsoleLogger, IConsoleLoggerSettings } from '@cdm-logger/server';
import { CdmLogger } from '@cdm-logger/core';


export const logger: CdmLogger.ILogger = ConsoleLogger.create('test', { level: 'trace' });


function MyComponent(props) {
    return <div>MyComponent {JSON.stringify(props)}</div>;
}



test('loading success', async () => {


    const routerConfig = (namespace = '') => ({
        [namespace + '/a']: {
            component: () => MyComponent,
        },
        ['/a']: {
            component: () => MyComponent,
        },
        ['/a/1']: {
            component: () => MyComponent,
        },
        ['/a/1/2']: {
            component: () => MyComponent,
        },
        ['/b']: {
            component: () => MyComponent,
        },
        ['/a/b']: {
            component: () => MyComponent,
        },
        ['/a/b/1']: {
            component: () => MyComponent,
        },
        ['/a/b/1/2']: {
            component: () => MyComponent,
        },
        ['/a/b/1/2/3']: {
            component: () => MyComponent,
        },
        [namespace + '/a/1']: {
            component: () => MyComponent,
        },
        [namespace + '/a/2']: {
            component: () => MyComponent,
        },
        [namespace + '/a/2/1']: {
            component: () => MyComponent,
        },
        [namespace + '/ab/2/1']: {
            component: () => MyComponent,
        },
        [namespace + '/b/1']: {
            component: () => MyComponent,
        },
        [namespace + '/b/c/e']: {
            component: () => MyComponent,
        },
    });



    console.log(getRoutes('/', routerConfig('@test')));
});
