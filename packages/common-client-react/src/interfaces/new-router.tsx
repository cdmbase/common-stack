import { FunctionComponent } from 'react';
// import { History, Location } from 'history-with-query';
import { match } from 'react-router-dom';

export interface IComponent extends FunctionComponent {
  getInitialProps?: Function;
  preload?: () => Promise<any>;
}


export interface IRouteMap<T=unknown> {
  [key: string]: IRoute & T
}
export interface IRoute {
  path?: string;
  exact?: boolean;
  redirect?: string;
  component?: IComponent;
  routes?: IRoute[];
  key?: any;
  strict?: boolean;
  sensitive?: boolean;
  wrappers?: any[];
  [k: string]: any;
}

export interface IRouteComponentProps<
  Params extends { [K in keyof Params]?: string } = {},
  Query extends { [K in keyof Query]?: string } = {}
  > {
  children: JSX.Element;
  location: any /** Location & { query: Query }; **/;
  route: IRoute;
  history: any /** History;**/;
  match: match<Params>;
}