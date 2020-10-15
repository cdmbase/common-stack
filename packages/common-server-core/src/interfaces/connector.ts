import { CdmLogger } from '@cdm-logger/core';

export interface IResolverOptions {
    pubsub: any;
    logger?: CdmLogger.ILogger;
    [key: string]: any;
}

export interface IDirectiveOptions {
    [key: string]: any;
    logger?: CdmLogger.ILogger;
}

export enum ConfigurationScope {
    WINDOW = 1,
    RESOURCE,
}

export interface IWebsocketConfig {
    [key: string]: any;
}

export interface IPreferences<T = ConfigurationScope> {
    [key: string]: IPreferencesData<T>;
}

export interface IRoles<T = ConfigurationScope> {
    [key: string]: IPreferencesData<T>;
}
export interface IPreferencesData<T = ConfigurationScope> {
    type?: string | string[];
    default?: string | boolean | number | any;
    description?: string;
    overridable?: boolean;
    scope?: T;
    settings?: string;
    enum?: any;
    enumDescriptions?: string[];
    permissions?: {
        [key: string]: string | boolean | unknown,
    };
    [key: string]: any;
}

/**
 * Formatted preferences data
 */
export interface IPreferncesTransformed<T = ConfigurationScope> {
    type: string;
    data: IPreferencesData<T>;
}

export interface IOverwritePreference {
    [key: string]: string | boolean | number | any;
}
