import * as  React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import resolvers from './resolvers';
import reducers from './reducers';
import Root from './components/Root';
import Home from './components/Home';
import About from './components/About';
import NotFound from './components/NotFound';
import { Feature } from '@common-stack/client-react';


export default new Feature({
  routeConfig: [
    {
      ['/']: { component: Root},
      ['/home']: { component: Home},
      ['/about']: { component: About},
    }],
  resolver: resolvers,
  reducer: { counter: reducers },
});
