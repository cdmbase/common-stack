import * as Logger from 'bunyan';
import { PubSub } from 'graphql-subscriptions';

export interface IResolverOptions {
    pubsub: any;
    logger?: Logger;
}

export interface IDirectiveOptions {
    [key: string]: any;
    logger?: Logger;
}
