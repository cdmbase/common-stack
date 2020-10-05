import { ConsoleLogger, IConsoleLoggerSettings } from '@cdm-logger/server';
import { CdmLogger } from '@cdm-logger/core';

const settings: IConsoleLoggerSettings = {
    level: process.env.LOG_LEVEL as CdmLogger.LoggerLevel  || 'trace',
};

const appName = process.env.APP_NAME || 'CDMBASE_APP';

export const logger = ConsoleLogger.create(appName, settings);
