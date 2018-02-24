import { IReducerRegistry } from '../interfaces';
import { ReducersMapObject, AnyAction, Reducer } from 'redux';
import { injectable } from 'inversify';


@injectable()
class ReducerRegistry implements IReducerRegistry<any> {
    private _emitChange;
    private _reducers: ReducersMapObject;

    constructor() {
        this._emitChange = null;
        this._reducers = {};
    }

    public getReducers() {
        return { ...this._reducers };
    }

    public register(name, reducer) {
        this._reducers = { ...this._reducers, [name]: reducer };
        if (this._emitChange) {
            this._emitChange(this.getReducers());
        }
    }

    public setChangeListener(listener) {
        this._emitChange = listener;
    }
}

export { ReducerRegistry };
