import * as _ from 'lodash';
import { interfaces } from 'inversify';
import { Feature } from '@common-stack/server-core';

import { Types } from './constants';
import { moduleFunc } from './containers';

const createServiceFunc = (container: interfaces.Container) => ({
    cache: container.get(Types.CacheService),
});

export default new Feature({
    schema: [],
    createServiceFunc,
    createContainerFunc: [moduleFunc],
});
