import { IResolverOptions, IDirectiveOptions } from '../interfaces';
import { merge, map, union, without, castArray } from 'lodash';

export const featureCatalog: any = {};

const combine = (features, extractor): any =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

export type FeatureParams = {
  schema?: string | string[],
  createRemoteSchemas?: Function | Function[],
  createDirectivesFunc?: Function | Function[],
  createResolversFunc?: Function | Function[],
  createContextFunc?: Function | Function[],
  beforeware?: any | any[],
  middleware?: any | any[],
  catalogInfo?: any | any[],
};

class Feature {
  public schema: string[];
  public createRemoteSchemas?: Function | Function[];
  public createDirectivesFunc: Function[];
  public createResolversFunc: Function[];
  public createContextFunc: Function[];
  public beforeware: Function[];
  public middleware: Function[];

  constructor(feature?: FeatureParams, ...features: Feature[]) {
    // console.log(feature.schema[0] instanceof string);
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key])),
    );
    this.schema = combine(arguments, arg => arg.schema);
    this.createDirectivesFunc = combine(arguments, arg => arg.createDirectivesFunc);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.beforeware = combine(arguments, arg => arg.beforeware);
    this.middleware = combine(arguments, arg => arg.middleware);
  }

  get schemas(): string[] {
    return this.schema;
  }

  public async createContext(req: any, connectionParams: any, webSocket?: any) {
    const results = await Promise.all(
      this.createContextFunc.map(createContext => createContext(req, connectionParams, webSocket)),
    );
    return merge({}, ...results);
  }

  public createResolvers(options?: IResolverOptions) {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(options)));
  }

  public createDirectives(options?: IDirectiveOptions) {
    return merge({}, ...this.createDirectivesFunc.map(createDirectives => createDirectives(options)));
  }

  get beforewares(): any[] {
    return this.beforeware;
  }

  get middlewares(): any[] {
    return this.middleware;
  }
}

export { Feature };
