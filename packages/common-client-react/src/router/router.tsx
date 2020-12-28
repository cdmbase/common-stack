import * as React from 'react';
import { Switch } from 'react-router-dom';
import { Feature } from '../connector';
import {IReactFeature} from '../interfaces';

const routerFactory = (routes) => <Switch>{routes}</Switch>;

export const FeatureWithRouterFactory = new Feature({
    routerFactory,
} as IReactFeature);
