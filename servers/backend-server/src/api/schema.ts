import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema, addErrorLoggingToSchema } from 'graphql-tools';
<<<<<<< HEAD:experimental/servers/backend-server/src/api/schema.ts
import { resolvers, typeDefs } from '@common-stack/graphql-schema';
import { GraphQLAnyObject } from './scalar';
const rootSchemaDef = require('./root-schema.graphqls');
// import rootSchemaDef from './root_schema.graphqls';
import { logger } from '@common-stack/utils';
=======
import * as _ from 'lodash';
import { resolvers, typeDefs } from '@common-stack/graphql-schema';
import { logger } from '@common-stack/utils';
import modules from '../modules';
import { IResolverOptions, IDirectiveOptions } from '@common-stack/server-core';

import { GraphQLAnyObject } from './scalar';
const rootSchemaDef = require('./root-schema.graphqls');
// import rootSchemaDef from './root_schema.graphqls';

>>>>>>> f4ab7cd01d19552faea5da1c006ed4e0322af3bd:servers/backend-server/src/api/schema.ts
import { pubsub } from '../container';

const DefaultResolver = {
  AnyObject: GraphQLAnyObject,
};

const resolverOptions: IResolverOptions = {
  pubsub,
  logger,
};

console.log('schemas', modules.schemas);

const schema: GraphQLSchema = makeExecutableSchema({
  resolvers: _.merge(resolvers(pubsub, logger), modules.createResolvers(resolverOptions)),
  typeDefs: [rootSchemaDef].concat(typeDefs).concat(modules.schemas) as Array<any>,
});

addErrorLoggingToSchema(schema, { log: (e) => logger.error(e) });

addMockFunctionsToSchema({
  mocks: {},
  preserveResolvers: true,
  schema,
});


export { schema };
