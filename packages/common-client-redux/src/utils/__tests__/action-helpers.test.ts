import { compose } from 'redux';
import { 
    sideAction, 
    withContext,
} from '../action-helpers';

import { Actions } from './utils';

const ID = 1;

describe('Action helpers', () => {
    it('[withContext]: should apply to plain redux action', () => {
        const action = id => compose(
            withContext('sync'),
        )({ type: Actions.DummySync, id });

        const result = action(ID);

        expect(result).toMatchObject({
            id: ID,
            type: Actions.DummySync,
            $dependencies: ['sync'],
        });
    });

    it('[withContext]: should apply to thunk action', () => {
        const action = id => compose(
            withContext('async'),
        )(dispatch => dispatch({ type: Actions.DummyAsync, id }));

        const result = action(ID);

        expect(result.$action).toBeInstanceOf(Function);
        expect(result).toMatchObject({
            $dependencies: ['async'],
        });
    });

    it('[sideAction]: should apply to plain redux action', () => {
        const action = id => compose(
            sideAction(),
        )({ type: Actions.DummySync, id });

        const result = action(ID);

        expect(result).toMatchObject({
            id: ID,
            $side: true,
            type: Actions.DummySync,
        });
    });

    it('[sideAction]: should apply to thunk action', () => {
        const action = id => compose(
            sideAction(),
        )((dispatch) => dispatch({ type: Actions.DummyAsync, id }));

        const result = action(ID);

        expect(result.$action).toBeInstanceOf(Function);
        expect(result).toMatchObject({
            $side: true,
        });
    });

    it('[withContext & sideAction]: should apply to plain redux action', () => {
        const action = id => compose(
            sideAction(),
            withContext('sync'),
        )({ type: Actions.DummySync, id });

        const result = action(ID);

        expect(result).toMatchObject({
            id: ID,
            $side: true,
            $dependencies: ['sync'],
            type: Actions.DummySync,
        });
    });
const wrap = action => (...args) => compose(
    sideAction(),
    withContext('async'),
)(action(...args));

    it('[withContext & sideAction]: should apply to thunk action', () => {
        const action = id => compose(
            sideAction(),
            withContext('async'),
        )((dispatch) => dispatch({ type: Actions.DummyAsync, id }));

        const result = action(ID);

        expect(result.$action).toBeInstanceOf(Function);
        expect(result).toMatchObject({
            $side: true,
            $dependencies: ['async']
        });
    });
});
