import { DocumentNode } from 'graphql';

import { merge, map, union, without, castArray } from 'lodash';

export const featureCatalog: any = {};

const combine = (features, extractor): any =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

export type FeatureParams = {
  schema?: DocumentNode | DocumentNode[],
  createDirectivesFunc?: Function | Function[],
  createResolversFunc?: Function | Function[],
  createContextFunc?: Function | Function[],
  beforeware?: any | any[],
  middleware?: any | any[],
  createFetchOptions?: Function | Function[],
  catalogInfo?: any | any[],
};

class Feature {
  public schema: DocumentNode[];
  public createDirectivesFunc: Function[];
  public createResolversFunc: Function[];
  public createContextFunc: Function[];
  public createFetchOptions: Function[];
  public beforeware: Function[];
  public middleware: Function[];

  constructor(feature?: FeatureParams, ...features: Feature[]) {
    // console.log(feature.schema[0] instanceof DocumentNode);
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key])),
    );
    this.schema = combine(arguments, arg => arg.schema);
    this.createDirectivesFunc = combine(arguments, arg => arg.createDirectivesFunc);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.beforeware = combine(arguments, arg => arg.beforeware);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
  }

  get schemas(): DocumentNode[] {
    return this.schema;
  }

  public async createContext(req: any, connectionParams: any, webSocket?: any) {
    const results = await Promise.all(
      this.createContextFunc.map(createContext => createContext(req, connectionParams, webSocket)),
    );
    return merge({}, ...results);
  }

  public createResolvers(pubsub: any) {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(pubsub)));
  }

  public createDirectives() {
    return merge({}, ...this.createDirectivesFunc.map(createDirectives => createDirectives()));
  }

  get beforewares(): any[] {
    return this.beforeware;
  }

  get middlewares(): any[] {
    return this.middleware;
  }

  get constructFetchOptions(): any {
    return this.createFetchOptions.length
      ? (...args) => {
        try {
          let result = {};
          for (let func of this.createFetchOptions) {
            result = { ...result, ...func(...args) };
          }
          return result;
        } catch (e) {
          console.log(e.stack);
        }
      }
      : null;
  }
}

export { Feature };
