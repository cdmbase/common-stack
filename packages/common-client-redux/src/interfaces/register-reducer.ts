import { } from 'redux';

export interface IReducerRegistry {

    getReducer;

    register(name: string, reducer: any);

    setChangeListener(listener: any);
}