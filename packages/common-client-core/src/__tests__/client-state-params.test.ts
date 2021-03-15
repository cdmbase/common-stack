
import gql from 'graphql-tag';
import { TestFeature } from './test-feature';
import { InMemoryCache, ApolloClient, Observable, ApolloLink,  } from '@apollo/client';
import { merge } from 'lodash';

describe('client-state-params', () => {
  const schema = `
  type Query {}
  type Mutation {}
  `;
  const resolvers = { Query: { foo: () => ({ bar: true }) } };
  const defaults = { foo: { bar: true, __typename: 'Bar' } };
  const query = gql`
    {
      foo @client {
        bar
      }
    }
  `;

  const remoteQuery = gql`
    {
      foo {
        bar
      }
    }
  `;

  const typeDefs = `
    type Todo {
      id: String
      message: String!
    }
    type Query {
      todo(id: String!): Todo
    }
  `;


  // feature1
  const resolvers1 = { Query: { foo1: () => ({ bar1: true, __typename: 'Bar1' }) } };
  const defaults1 = { foo1: { bar1: false, __typename: 'Bar1' } };
  const query1 = gql`
      {
        foo1 @client {
          bar1
        }
      }
    `;

  const remoteQuery1 = gql`
      {
        foo1 {
          bar1
        }
      }
    `;

  const typeDefs1 = `
      type Bar1 {
        bar1: Boolean
      }
      extend type Query {
        foo1(): Bar1
      }
    `;

  // feature2
  const resolvers2 = { Query: { foo2: () => ({ bar2: true }) } };
  const defaults2 = { foo2: { bar2: false, __typename: 'Bar2' } };
  const query2 = gql`
      {
        foo2 @client {
          bar2
        }
      }
    `;

  const remoteQuery2 = gql`
      {
        foo2 {
          bar2
        }
      }
    `;

  const typeDefs2 = `
      type Todo2 {
        id: String
        message: String!
      }
      extend type Query {
        todo2(id: String!): Todo2
      }
    `;

  const module1 = new TestFeature({
    clientStateParams: [{ resolvers: resolvers1, defaults: defaults1, typeDefs: typeDefs1 }],
  });

  const module2 = new TestFeature({
    clientStateParams: [{ resolvers: resolvers2, defaults: defaults2, typeDefs: typeDefs2 }],
  });

  const finalModule = new TestFeature(module1, module2, new TestFeature({ clientStateParams: [{ typeDefs: schema }] }));

  it('merge client-state', () => {
    expect({ ...finalModule.getStateParams() }).toMatchSnapshot();
  });

  it('writes defaults to the cache upon initialization', () => {
    const cache = new InMemoryCache();

    cache.writeData({
      data: defaults,
    });
    expect(cache.extract()).toMatchSnapshot();
  });

  it('should return empty string when typedefs not defined', () => {
    const moduleNoTypedef = new TestFeature({
      clientStateParams: [{ resolvers: resolvers1, defaults: defaults1 }],
    });

    expect(moduleNoTypedef.getStateParams().typeDefs).toBe('');
  });

  it('concatenates schema strings if typeDefs are passed in as an array', () => {
    const anotherSchema = `
      type Foo {
        foo: String!
        bar: String
      }
    `;

    const nextLink = new ApolloLink(operation => {
      const { schemas } = operation.getContext();
      expect(schemas).toMatchSnapshot();
      return Observable.of({
        data: { foo1: { bar1: true, __typename: 'Bar1' } },
      });
    });

    const cache = new InMemoryCache();
    cache.writeData({
      data: finalModule.getStateParams().defaults,
    });
    const client = new ApolloClient({
      cache,
      resolvers: finalModule.getStateParams().resolvers,
      typeDefs:  schema.concat(finalModule.getStateParams().typeDefs as string),
    });


    client
      .query({ query: query1 })
      .then(({ data }) => {
        expect(data).toMatchObject({ foo1: { bar1: true, __typename: 'Bar1' } });
      });
  });

  // TODO
  // describe('fragment matcher', () => {
  //   it('does basic things', () => {
  //     const resolver = fieldName => fieldName;
  //     const query = gql`
  //       {
  //         a {
  //           b
  //           ...yesFrag
  //           ...noFrag
  //           ... on Yes {
  //             e
  //           }
  //           ... on No {
  //             f
  //           }
  //         }
  //       }
  //       fragment yesFrag on Yes {
  //         c
  //       }
  //       fragment noFrag on No {
  //         d
  //       }
  //     `;
  //     const fragmentMatcher: FragmentMatcher = (_, typeCondition) =>
  //       typeCondition === 'Yes';
  //     const resultWithMatcher = graphql(resolver, query, '', null, null, {
  //       fragmentMatcher,
  //     });

  //     expect(resultWithMatcher).toEqual({
  //       a: {
  //         b: 'b',
  //         c: 'c',
  //         e: 'e',
  //       },
  //     });

  //     const resultNoMatcher = graphql(resolver, query, '', null, null);

  //     expect(resultNoMatcher).toEqual({
  //       a: {
  //         b: 'b',
  //         c: 'c',
  //         d: 'd',
  //         e: 'e',
  //         f: 'f',
  //       },
  //     });
  //   });
  // });
});
