import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import StaticRouter from 'react-router/StaticRouter';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { Feature } from '../connector';
import { ConsoleLogger, IConsoleLoggerSettings } from '@cdm-logger/server';
import { CdmLogger } from '@cdm-logger/core';
export const logger: CdmLogger.ILogger = ConsoleLogger.create('test', { level: 'trace' });

describe('renderRoutes', () => {
  let renderedRoutes;
  let renderedExtraProps;
  const Comp = ({ route, route: { routes }, ...extraProps }) => (
    renderedRoutes.push(route),
    renderedExtraProps.push(extraProps),
    renderRoutes(routes)
  );

  beforeEach(() => {
    renderedRoutes = [];
    renderedExtraProps = [];
  });

  it('renders pathless routes', () => {
    const routeToMatch = {
      component: Comp,
    };
    const genRoutes = [
      {
        ['super']: { component: Comp },
      },
    ];
    const routes = [routeToMatch];

    const connector = new Feature({ routeConfig: genRoutes });

    ReactDOMServer.renderToString(
      <StaticRouter location="/path" context={{}}>
        {renderRoutes(routes)}
      </StaticRouter>,
    );
    expect(renderedRoutes.length).toEqual(1);
    expect(renderedRoutes[0]).toEqual(routeToMatch);
  });

  // it('passes extraProps to the component rendered by a pathless route', () => {
  //     const routeToMatch = {
  //         component: Comp,
  //     };
  //     const routes = [routeToMatch];
  //     const extraProps = { anExtraProp: 'anExtraPropValue' };

  //     ReactDOMServer.renderToString(
  //         <StaticRouter location="/path" context={{}}>
  //             {renderRoutes(routes, extraProps)}
  //         </StaticRouter>,
  //     );
  //     expect(renderedExtraProps.length).toEqual(1);
  //     expect(renderedExtraProps[0].anExtraProp).toEqual('anExtraPropValue');
  // });
});
