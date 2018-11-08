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
  createDataSourceFunc?: Function | Function[],
  createContainerFunc?: Function | Function[],
  createAsyncContainerFunc?: Function | Function[],
  preCreateServiceFunc?: Function | Function[],
  updateContainerFunc?: any | any[],
  createPreference?: Function | Function[],
  overwritePreference?: Function | Function[],
  dataIdFromObject?: Function | Function[],
  disposeFunc?: any | any[],
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
  public createAsyncContainerFunc: Function[];
  public createDataSourceFunc: Function[];
  public preCreateServiceFunc: Function[];
  public disposeFunc: any[];
  public updateContainerFunc: any[];
  public beforeware: Function[];
  public middleware: Function[];
  public createPreference: any[];
  public overwritePreference: Function[];

  private services;
  private container;
  private dataSources;

  constructor(feature?: FeatureParams, ...features: Feature[]) {
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key])),
    );
    this.schema = combine(arguments, arg => arg.schema);
    this.createDirectivesFunc = combine(arguments, arg => arg.createDirectivesFunc);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.createServiceFunc = combine(arguments, arg => arg.createServiceFunc);
    this.preCreateServiceFunc = combine(arguments, arg => arg.preCreateServiceFunc);
    this.disposeFunc = combine(arguments, arg => arg.disposeFunc);

    this.createContainerFunc = combine(arguments, arg => arg.createContainerFunc);
    this.createAsyncContainerFunc = combine(arguments, arg => arg.createAsyncContainerFunc);
    this.updateContainerFunc = combine(arguments, arg => arg.updateContainerFunc);
    this.createDataSourceFunc = combine(arguments, arg => arg.createDataSourceFunc);
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
  public createServiceContext(options, updateOptions?: any) {
    return async (req: any, connectionParams: any, webSocket?: any) => {
      await this.createService(options, updateOptions);

      const results = await Promise.all(
        this.createContextFunc.map(createContext => createContext(req, connectionParams, webSocket)),
      );
      return merge({}, ...results, { ...this.services });
    };

  }

  /**
   * Its wrapper to container to get services
   * @param container
   */
  public async createService(options, updateOptions?: any) {
    try {
      if (this.container) {
        this.updateContainers(options, updateOptions);
      } else {
        await this.createContainers(options);
        await Promise.all(this.preCreateServiceFunc.map(async (createService) => await createService(this.container)));
      }
      this.services = merge({}, ...this.createServiceFunc.map(createService => createService(this.container)));
      return this.services;
    } catch (err) {
      throw err;
    }

  }

  public createDataSource(options?: any) {
    return this.dataSources = merge({}, ...this.createDataSourceFunc.map(createDataSource => createDataSource(this.container)));
  }

  public createResolvers(options?: IResolverOptions) {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(options)));
  }

  public createDirectives(options?: IDirectiveOptions) {
    return merge({}, ...this.createDirectivesFunc.map(createDirectives => createDirectives(options)));
  }

  public async createContainers(options) {
    this.container = new Container();
    this.createContainerFunc.map(createModule => this.container.load(createModule(options)));
    await Promise.all(this.createAsyncContainerFunc
      .map(async asyncCreateModule => await this.container.loadAsync(asyncCreateModule(options))));
    this.container.bind('IDefaultSettings').toConstantValue(this.getPreferences());
    return this.container;
  }

  public updateContainers(options, updateOptions?: any) {
    let mergedModules = merge({}, ...this.updateContainerFunc);
    const matchingModules = [];
    if (updateOptions) {
      updateOptions.forEach(option => {
        const dispose = this.disposeFunc.find(el => el.container === option);
        if (dispose) {
          this.services[dispose.ctx].dispose();
        }
        const searchModule = mergedModules[option];
        if (searchModule) {
          matchingModules.push(searchModule);
        }
      });
    }

    matchingModules.map(createModule => this.container.load(createModule(options)));
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
