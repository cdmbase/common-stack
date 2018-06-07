import { ClientLogger } from '@cdm-logger/client';
import * as Logger from 'browser-bunyan';

const appName = (process.env && process.env.APP_NAME) || 'FullStack';
const logLevel = (process.env && process.env.LOG_LEVEL) || 'info';
const logger: Logger = ClientLogger.create(appName, { level: logLevel });

export { logger };
