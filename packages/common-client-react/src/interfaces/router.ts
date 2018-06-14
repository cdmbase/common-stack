import { LoadingComponentProps } from 'react-loadable';

export interface IRouteData {
  [key: string]: {
    component: () => any | any;
    loading?: React.ComponentType<LoadingComponentProps> | (() => null);
    exact?: boolean;
    strict?: boolean;
  };
}

export interface IMappedData {
  component: any;
  route: string;
}
