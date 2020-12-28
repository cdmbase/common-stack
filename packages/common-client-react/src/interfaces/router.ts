import { LoadingComponentProps } from 'react-loadable';
// import { IRouteData as IOrigROuteData } from '@common-stack/client-core';
// export { IMappedData } from '@common-stack/client-core';

export interface ICoreRouteData<T> {
    [key: string]: {
        loading?: T;
        component: any;
        exact?: boolean;
        strict?: boolean;
    };
}

export interface IMappedData {
    component: any;
    route: string;
    exact?: boolean;
    strict?: boolean;
}

export interface IRouteData extends ICoreRouteData<React.ComponentType<LoadingComponentProps> | (() => null)> {
}
