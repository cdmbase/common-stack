import * as React from 'react';
import { Feature } from '../connector';
import { Route } from 'react-router-dom';

import 'jest';

describe('Test Feature', () => {

    it('test Connector with router', () => {
        const feature = new Feature({ route: <Route exact={true} path="/" component={() => <div>test</div>} /> });
        console.log(feature);
    });
});
