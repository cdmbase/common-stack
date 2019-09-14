import thunk from 'redux-thunk';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
    createStore, applyMiddleware, Middleware,
    compose, combineReducers, StoreEnhancer,
} from 'redux';

import { contextMiddleware } from '../context-middleware';

export enum Actions {
    DummySync = 'DYMMY_SYNC',
    DummyAsync = 'DYMMY_ASYNC',
}

export const contextResolvers = {
    sync: () => true,
    async: () => of(true).pipe(delay(250)).toPromise(),
};

const sync = (state = {}, action) => {
    switch(action.type) {
        case Actions.DummySync: 
            return Object.assign(action.payload, { context: action.context });
        default: return state;
    }
};

const async = (state = {}, action) => {
    switch(action.type) {
        case Actions.DummyAsync: 
            return action.payload;
        default: return state;
    }
};

export const rootReducers = combineReducers({ sync, async });

export const createReduxStore = ({ reducers, initialState, contextResolvers }) => {
    const middlewares: Middleware[] = [
        thunk,
        contextMiddleware(contextResolvers),
    ];

    const enhancers: () => StoreEnhancer<any>[] = () => [
        applyMiddleware(...middlewares),
    ];

    return createStore(
        reducers,
        initialState,
        compose(...enhancers()),
    );
};
