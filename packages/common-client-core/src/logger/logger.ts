import { ClientLogger } from '@cdm-logger/client';

const appName = (process.env && process.env.APP_NAME) || 'FullStack';
const logLevel = (process.env && process.env.LOG_LEVEL) || 'info';
const logger = ClientLogger.create(appName, { level: logLevel });

export { logger };
