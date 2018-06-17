
import * as React from 'react';
import TopNav from './TopNav';
import SiderMenu from './SiderMenu';

export default ({ route, location }) => (
  <div>
    <TopNav route={route} />
    {/* <SiderMenu location={location} /> */}
    <div className="ui main text container">
      <h1>About Page</h1>
    </div>
  </div>
);
