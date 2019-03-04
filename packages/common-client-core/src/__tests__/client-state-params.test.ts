
import gql from 'graphql-tag';
import { TestFeature } from './test-feature';
import { withClientState } from 'apollo-link-state';

describe('client-state-params', () => {
    const schema = `
    type Query {}
    type Mutation {}
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

    it('merge client-state', () => {

        const module1 = new TestFeature({
            clientStateParams: [{ resolvers: resolvers1, defaults: defaults1, typeDefs: typeDefs1 }],
        });

        const module2 = new TestFeature({
            clientStateParams: [{ resolvers: resolvers2, defaults: defaults2, typeDefs: typeDefs2 }],
        });

        const finalModule = new TestFeature(module1, module2, new TestFeature({ clientStateParams: [{ typeDefs: schema}]}));

        expect({...finalModule.getStateParams}).toMatchSnapshot();
    });

});
