import { LoadingComponentProps } from 'react-loadable';

export interface IRouteData {
  [key: string]: {
    loading?: React.ComponentType<LoadingComponentProps> | (() => null);
    component: any;
    exact?: boolean;
    strict?: boolean;
  } ;
}

export interface IMappedData {
  component: any;
  route: string;
  exact?: boolean;
  strict?: boolean;
}
