import { inject } from 'inversify';


export const TYPES = {
    IReducerRegistry: Symbol('IReducerRegistry'),
};

export const InjectReducerRegistry = inject(TYPES.IReducerRegistry);
