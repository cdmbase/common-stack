
import * as React from 'react';
import TopNav from './TopNav';

export default ({ route }) => (
  <div>
    <TopNav route={route} />
    <div className="ui main text container">
      <h1>Staic Page</h1>
    </div>
  </div>
);
