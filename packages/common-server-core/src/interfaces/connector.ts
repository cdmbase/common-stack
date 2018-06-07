import * as Logger from 'bunyan';
import { PubSub } from 'graphql-subscriptions';

export interface IResolverOptions {
    pubsub: any;
    logger?: Logger;
    [key: string]: any;
}

export interface IDirectiveOptions {
    [key: string]: any;
    logger?: Logger;
}
