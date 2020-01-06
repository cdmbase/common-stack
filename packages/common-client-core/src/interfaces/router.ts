
export interface IRouteData<T> {
  [key: string]: {
    loading?: T;
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
