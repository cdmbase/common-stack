import * as React from 'react';
import { Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Course from '../connector/course';

export function renderQuery(loading, error, data) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return data.allPageHistories.map(allHistory => (
    <Course key={allHistory.id} history={allHistory} />
  ));
}

function AddHistory(props) {
  const { mutate } = props.client;
  const { push, pageNumber } = props;
  mutate({ mutation: gql`
    mutation {
      createPageHistory(number: ${pageNumber}) {
        number
      }
    },
    `, refetchQueries: [{ query: gql`
          {
            allPageHistories(orderBy: id_DESC, first: 5) {
              id
              number
            }
          }
        ` }] }).catch(() => {});
  push(`/history/${pageNumber}`);
  return null;
};

export class History extends React.Component {
  render() {
    return (
      <Query
        query={gql`
          {
            allPageHistories(orderBy: id_DESC, first: 5) {
              id
              number
            }
          }
        `}
      >
        {({ loading, error, data }) => renderQuery(loading, error, data)}
      </Query>
    );
  }
}

export default withApollo(AddHistory as any);

