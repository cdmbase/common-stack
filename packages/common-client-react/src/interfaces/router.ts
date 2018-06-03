import { LoadingComponentProps } from 'react-loadable';

export interface IRouteData {
    [key: string]: {
        component: () => any;
        loading?: React.ComponentType<LoadingComponentProps> | (() => null);
    };
}
