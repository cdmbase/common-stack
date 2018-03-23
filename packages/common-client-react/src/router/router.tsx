import * as React from 'react';
import { Switch } from 'react-router-dom';
import { Feature } from '../connector';

const routerFactory = (routes) => <Switch>{routes}</Switch>;

export const FeatureWithRouterFactory = new Feature({
    routerFactory,
});
