import { LoadingComponentProps } from 'react-loadable';
import { any } from 'prop-types';
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
    path?: string;
    component?: any;
    route?: string;
    exact?: boolean;
    strict?: boolean;
    [key: string]: any;
}

export interface IRouteData extends ICoreRouteData<React.ComponentType<LoadingComponentProps> | (() => null)> {
}
