import { ClientLogger } from '@cdm-logger/client';
import * as Logger from 'bunyan';

const appName = process.env.APP_NAME || 'FullStack';
const logLevel = process.env.LOG_LEVEL || 'info';
const logger = ClientLogger.create(appName, { level: logLevel });

export { logger };
