import { IResolverOptions, IDirectiveOptions } from '../interfaces';
import { merge, map, union, without, castArray } from 'lodash';
import { Container, interfaces } from 'inversify';
import { getCurrentPreferences, transformPrefsToArray } from '../utils';
export const featureCatalog: any = {};

const combine = (features, extractor): any =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

export type FeatureParams = {
  schema?: string | string[],
  createRemoteSchemas?: Function | Function[],
  createDirectivesFunc?: Function | Function[],
  createResolversFunc?: Function | Function[],
  createContextFunc?: Function | Function[],
  createServiceFunc?: Function | Function[],
  createContainerFunc?: Function | Function[],
  createPreference?: any | any[],
  overwritePreference?: Function | Function[],
  dataIdFromObject?: Function | Function[];
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
  public createServiceFunc: Function[];
  public createContainerFunc: Function[];
  public beforeware: Function[];
  public middleware: Function[];
  public createPreference: any[];
  public overwritePreference: Function[];

  constructor(feature?: FeatureParams, ...features: Feature[]) {
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key])),
    );
    this.schema = combine(arguments, arg => arg.schema);
    this.createDirectivesFunc = combine(arguments, arg => arg.createDirectivesFunc);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.createServiceFunc = combine(arguments, arg => arg.createServiceFunc);
    this.createContainerFunc = combine(arguments, arg => arg.createContainerFunc);
    this.beforeware = combine(arguments, arg => arg.beforeware);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.createPreference = combine(arguments, arg => arg.createPreference);
    this.overwritePreference = combine(arguments, arg => arg.overwritePreference);
  }

  get schemas(): string[] {
    return this.schema;
  }

  /**
   * Creates context
   * @param req
   * @param connectionParams
   * @param webSocket
   * @deprecated
   */
  public async createContext(req: any, connectionParams: any, webSocket?: any) {
    const results = await Promise.all(
      this.createContextFunc.map(createContext => createContext(req, connectionParams, webSocket)),
    );
    return merge({}, ...results);
  }

  /**
   * If you need to attach service to Graphql Context, you can use this function.
   * It should be called twice to get the context.
   */
  public createServiceContext(options) {
    const services = this.createService(options);
    return async (req: any, connectionParams: any, webSocket?: any) => {
      const results = await Promise.all(
        this.createContextFunc.map(createContext => createContext(req, connectionParams, webSocket)),
      );
      return merge({}, ...results, { ...services });
    };

  }

  /**
   * Its wrapper to container to get services
   * @param container
   */
  public createService(options) {
    const container = this.createContainers(options);
    return merge({}, ...this.createServiceFunc.map(createService => createService(container)));
  }

  public createResolvers(options?: IResolverOptions) {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(options)));
  }

  public createDirectives(options?: IDirectiveOptions) {
    return merge({}, ...this.createDirectivesFunc.map(createDirectives => createDirectives(options)));
  }

  public createContainers(options) {
    const container = new Container();
    this.createContainerFunc.map(createModule => container.load(createModule(options)));
    return container;
  }

  public createDefaultPreferences() {
    return transformPrefsToArray(merge(...this.createPreference));
  }

  get beforewares(): any[] {
    return this.beforeware;
  }

  get middlewares(): any[] {
    return this.middleware;
  }

  public getPreferences() {
    const defaultPrefs = merge(...this.createPreference);
    const overwritePrefs = merge(...this.overwritePreference);
    const fullPrefs = getCurrentPreferences(defaultPrefs, overwritePrefs);
    return transformPrefsToArray(fullPrefs);
  }

}

export { Feature };
