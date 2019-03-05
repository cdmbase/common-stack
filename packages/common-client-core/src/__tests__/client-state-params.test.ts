
import gql from 'graphql-tag';
import { TestFeature } from './test-feature';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { Observable, ApolloLink, execute } from 'apollo-link';
import { merge } from 'lodash';

describe('client-state-params', () => {
  const schema = `
  type Query {}
  type Mutation {}
  `;
  const resolvers = { Query: { foo: () => ({ bar: true }) } };
  const defaults = { foo: { bar: false, __typename: 'Bar' } };
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
  const resolvers1 = { Query: { foo1: () => ({ bar1: true }) } };
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
      type Todo1 {
        id: String
        message: String!
      }
      extend type Query {
        todo1(id: String!): Todo1
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
    expect({ ...finalModule.getStateParams }).toMatchSnapshot();
  });

  it('writes defaults to the cache upon initialization -- original', () => {
    const cache = new InMemoryCache();

    withClientState({ cache, resolvers, defaults });
    expect(cache.extract()).toMatchSnapshot();
  });

  it('writes defaults to the cache upon initialization', () => {
    const cache = new InMemoryCache();
    withClientState({
      cache,
      resolvers: finalModule.getStateParams.resolvers,
      defaults: finalModule.getStateParams.defaults,
    });
    expect(cache.extract()).toMatchSnapshot();
  });

  it('concatenates schema strings if typeDefs are passed in as an array', done => {
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

    const client = withClientState({
      resolvers: finalModule.getStateParams.resolvers,
      defaults: finalModule.getStateParams.defaults,
      typeDefs: schema.concat(finalModule.getStateParams.typeDefs as string),
    });

    execute(client.concat(nextLink), {
      query: remoteQuery1,
    }).subscribe(() => done(), done.fail);
  });

});
