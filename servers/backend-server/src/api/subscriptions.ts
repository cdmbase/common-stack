///<reference types='webpack-env' />

import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute } from 'graphql';
import { subscribe } from 'graphql/subscription';

import { Module } from 'webpack';
import { schema } from './schema';

import { GRAPHQL_ROUTE } from '../ENDPOINTS';
import { logger } from '@common-stack/utils';
import { counterRepo } from '../container';
<<<<<<< HEAD:experimental/servers/backend-server/src/api/subscriptions.ts
import { database } from '@common-stack/graphql-schema';
import { ICounterRepository, TYPES as CounterTypes } from '@common-stack/store';
=======
import { database } from '@common-stack/graphql-schema';
import { ICounterRepository, TYPES as CounterTypes } from '@common-stack/store';
import modules from '../modules';
>>>>>>> f4ab7cd01d19552faea5da1c006ed4e0322af3bd:servers/backend-server/src/api/subscriptions.ts

let subscriptionServer;

const addSubscriptions = httpServer => {
    subscriptionServer = SubscriptionServer.create({
        schema,
        execute,
        subscribe,
        onConnect: (connectionParams, webSocket) => ({ Count: counterRepo, ...modules.createContext(null, connectionParams, webSocket) }),
        onOperation: async (message, params, webSocket) => {
            params.context = await modules.createContext(null, message.payload, webSocket);
            return params;
        },
    }, {
            server: httpServer,
            path: GRAPHQL_ROUTE,
        });
};

const addGraphQLSubscriptions = httpServer => {
    if (module.hot && module.hot.data) {
        const prevServer = (module.hot.data as any).subscriptionServer;
        if (prevServer && prevServer.wsServer) {
            logger.debug('Reloading the subscription server.');
            prevServer.wsServer.close(() => {
                addSubscriptions(httpServer);
            });
        }
    } else {
        addSubscriptions(httpServer);
    }
};

if (module.hot) {
    module.hot.dispose(data => {
        try {
            (data as any).subscriptionServer = subscriptionServer;
        } catch (error) {
            logger.error(error.stack);
        }
    });
}
export { addGraphQLSubscriptions };

