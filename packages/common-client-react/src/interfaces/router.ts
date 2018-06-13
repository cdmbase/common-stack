import { LoadingComponentProps } from 'react-loadable';

export interface IRouteData {
    component: () => any | any;
    path?: String;
    routes?: Array<IRouteData> | IRouteData;
    exact?: boolean;
    loading?: React.ComponentType<LoadingComponentProps> | (() => null);
}
