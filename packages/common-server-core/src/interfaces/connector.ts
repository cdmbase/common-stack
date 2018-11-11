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

export enum ConfigurationScope {
    WINDOW = 1,
    RESOURCE,
}


export interface IPreferences {
    [key: string]: IPreferencesData;
}

export interface IPreferencesData {
    type?: string | string[];
    default?: string | boolean | number | any;
    description?: string;
    overridable?: boolean;
    scope?: ConfigurationScope;
    settings?: string;
    enum?: any;
    enumDescriptions?: string[];
    [key: string]: any;
}

/**
 * Formatted preferences data
 */
export interface IPreferncesTransformed {
    type: string;
    data: IPreferencesData;
}

export interface IOverwritePreference {
    [key: string]: string | boolean | number | any;
}
