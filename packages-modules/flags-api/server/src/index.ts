export * from './constants';
export * from './interfaces';

import * as _ from 'lodash';
import { interfaces } from 'inversify';
import { Feature } from '@common-stack/server-core';

import { ETypes } from './constants';
import { moduleFunc } from './container';
import { storeModuleFunc } from './store';

const createServiceFunc = (container: interfaces.Container) => ({
    flags: container.get(ETypes.FlagsService),
});

export default new Feature({
    schema: [],
    createServiceFunc,
    createContainerFunc: [moduleFunc, storeModuleFunc],
});
