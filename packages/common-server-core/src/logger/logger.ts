import { ConsoleLogger, IConsoleLoggerSettings } from '@cdm-logger/server';
import { LoggerLevel } from '@cdm-logger/core';
import * as Logger from 'bunyan';

const settings: IConsoleLoggerSettings = {
    level: process.env.LOG_LEVEL as LoggerLevel  || 'trace',
};

const appName = process.env.APP_NAME || 'CDMBASE_APP';

export const logger: Logger = ConsoleLogger.create(appName, settings);
