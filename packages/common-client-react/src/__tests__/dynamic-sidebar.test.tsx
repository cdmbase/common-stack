import * as React from 'react';
import "jsdom-global/register";
import { mount } from "enzyme";
import AddHistory, { History, renderQuery } from "../utils/dynamic-sidebar";
import { Query } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import gql from "graphql-tag";

describe("Test on dynamic-sidebar", () => {
    const props = {
        push: jest.fn(),
        pageNumber: 5,
    };
    const mocks = [{
        request: {
            query: gql`
            query {
              allPageHistories(orderBy: id_DESC, first: 5) {
                id
                number
              }
              name
            }
          `, 
            refetchQueries: [{
                query: gql`{
                    allPageHistories(orderBy: id_DESC, first: 5) {
                        id
                        number
                    }
                }`
            }]
        }, result: { data: { allPageHistories: {} } }
    }];
    it("should render Query", () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks} addTypename={false}>
                <History />
            </MockedProvider>
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(Query)).toHaveLength(1);
    });

    it("should render mutation", () => {
        const mock = [
            {
            request: {
                query: gql`
                    mutation {
                        createPageHistory(number: 12) {
                            number
                        }
                    }`,
                variables: { name: 'Test' },
            },
            result: { data: {} },
            },
        ];
        const wrapper = mount(
        <MockedProvider mocks={mock}>
            <AddHistory {...props} />
        </MockedProvider>);
        expect(wrapper).toMatchSnapshot();

    });

    it('return course component', () => {
        const props = { 
            loading: false, 
            error: false, 
            data: { 
                allPageHistories: [{
                    number: 1,
                }] 
            } 
        };
        const wrapper = renderQuery(props.loading, props.error, props.data);
        expect(wrapper).toMatchSnapshot();
    });
});