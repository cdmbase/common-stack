import module from './module';
import { Feature } from '@common-stack/server-core';

export * from './constants';
export { Cache } from './services';
export default new Feature(module);

