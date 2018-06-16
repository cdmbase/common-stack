import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import StaticRouter from 'react-router/StaticRouter';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { Feature } from '../connector';
import { ConsoleLogger, IConsoleLoggerSettings } from '@cdm-logger/server';
import { LoggerLevel } from '@cdm-logger/core';
import * as Logger from 'bunyan';
export const logger: Logger = ConsoleLogger.create('test', { level: 'trace' });

describe('integration', () => {
    it('generates the same matches in renderRoutes and matchRoutes', () => {
        const rendered = [];

        const Comp = ({ match, route: { routes } }) => (
            rendered.push(match), renderRoutes(routes)
        );

        const genRoutes = [
            {
                ['/ghost']: { component: Comp },
                ['/pepper']: { component: Comp, exact: false },
                ['/pepper/:type']: { component: Comp,  exact: false},
                ['/pepper/:type/scoville']: { component: Comp, exact: false },
            },
        ];
        const result = [
            {
                path: '/ghost',
                component: Comp,
            },
            {
                path: '/pepper',
                component: Comp,
                exact: false,
                routes: [
                    {
                        path: '/pepper/:type',
                        component: Comp,
                        exact: false,
                        routes: [
                            {
                                path: '/pepper/:type/scoville',
                                component: Comp,
                                exact: false,
                            },
                        ],
                    },
                ],
            },
        ];
        const connector = new Feature({ routeConfig: genRoutes });
        const connectorRoutes = connector.getConfiguredRoutes();
        expect(connectorRoutes).toMatchObject(result);
        const pathname = '/pepper/jalepeno';
        const branch = matchRoutes(connectorRoutes, pathname);
        ReactDOMServer.renderToString(
            <StaticRouter location={pathname} context={{}}>
                {renderRoutes(connectorRoutes)}
            </StaticRouter>,
        );

        expect(branch).toMatchSnapshot();
        expect(branch.length).toEqual(2);
        expect(rendered.length).toEqual(2);
        expect(branch[0].match).toEqual(rendered[0]);
        expect(branch[1].match).toEqual(rendered[1]);
    });

});
