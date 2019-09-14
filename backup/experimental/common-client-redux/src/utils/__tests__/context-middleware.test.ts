import {
    createSideAction,
    createActionWithContext,
} from '../action-helpers';

import { Actions, createReduxStore, rootReducers, contextResolvers } from './utils';

const ID = 1;
const sleep = (ms) => 
    new Promise(resolve => setTimeout(resolve, ms));

const store = createReduxStore({
    initialState: {
        sync: {},
        async: {},
    },
    contextResolvers,
    reducers: rootReducers,
});

const syncAction = id => ({ 
    payload: { id },
    type: Actions.DummySync, 
});

const asyncAction = id => (dispatch, getState, context) => dispatch({
    type: Actions.DummyAsync, 
    payload: { id, context },
});

describe('Context Middleware', () => {
    xit('[contextMiddleware]: check async/async context resolvers in thunk actions', async () => {
        const action = createActionWithContext(asyncAction, ['sync', 'async']);
        store.dispatch(action(ID));

        await sleep(1000);

        const state = store.getState();
        expect(state).toMatchObject({
            async: {
                id: ID,
                context: { sync: true, async: true },
            },
        });
    });
    it('[contextMiddleware]: check async/async context in reducers for plain actions', async () => {
        const action = createActionWithContext(syncAction, ['sync', 'async']);
        store.dispatch(action(ID));

        await sleep(1000);

        const state = store.getState();
        expect(state).toMatchObject({
            sync: {
                id: ID,
                context: { sync: true, async: true },
            },
        });
    })
});
