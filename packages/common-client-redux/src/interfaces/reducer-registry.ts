import { ReducersMapObject, Reducer } from 'redux';

export interface IReducerRegistry<S> {

    getReducers: () => ReducersMapObject;

    register(name: string, reducer: Reducer<S>);

    setChangeListener(listener: any);
}
