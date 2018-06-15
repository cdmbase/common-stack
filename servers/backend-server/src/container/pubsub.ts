import { PubSub, PubSubEngine } from 'graphql-subscriptions';
import { NatsPubSub } from 'graphql-nats-subscriptions';
<<<<<<< HEAD:experimental/servers/backend-server/src/container/pubsub.ts
import { addApolloLogging } from 'apollo-logger';
import { logger } from '@common-stack/utils';
=======
import { wrapPubSub } from 'apollo-logger';
import { logger } from '@common-stack/utils';
>>>>>>> f4ab7cd01d19552faea5da1c006ed4e0322af3bd:servers/backend-server/src/container/pubsub.ts
import { SETTINGS } from '../config';
import * as nats from 'nats';

export const client = () => nats.connect({
    'url': SETTINGS.NATS_URL,
    'user': SETTINGS.NATS_USER,
    'pass': SETTINGS.NATS_PW as string,
    reconnectTimeWait: 1000,
});

export const pubsub = process.env.NODE_ENV === 'development' ?
    SETTINGS.apolloLogging ? wrapPubSub(new PubSub(), { logger: logger.debug.bind(logger) }) :
        new PubSub() : new NatsPubSub({ client: client(), logger });
