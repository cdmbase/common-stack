import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLAnyObject } from './scalar';
import GraphQLURI from '@cdmbase/graphql-type-uri';


export const resolvers = {
    AnyObject: GraphQLAnyObject,
    Date: GraphQLDate,
    Time: GraphQLTime,
    URI: GraphQLURI('URI'),
    URIInput: GraphQLURI('URIInput'),
    DateTime: GraphQLDateTime,
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
};
