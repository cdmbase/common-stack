import { IResolverOptions, IDirectiveOptions, IPreferences, IOverwritePreference, IPreferncesTransformed } from '../interfaces';
import { merge, map, union, without, castArray } from 'lodash';
import { Container, interfaces } from 'inversify';
import { getCurrentPreferences, transformPrefsToArray } from '../utils';
export const featureCatalog: any = {};

const combine = (features, extractor): any =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

export interface IFederationServiceOptions {
  port: number;
  config?: any; // for apollo-server
}

export type FederationServiceDeclaration = (options: IFederationServiceOptions) => Promise<void>;

export type FeatureParams = {
  schema?: string | string[],
  createRemoteSchemas?: Function | Function[],
  createDirectivesFunc?: Function | Function[],
  createResolversFunc?: Function | Function[],
  createContextFunc?: Function | Function[],
  createServiceFunc?: Function | Function[],
  createDataSourceFunc?: Function | Function[],
  createContainerFunc?: Function | Function[],
  createHemeraContainerFunc?: Function | Function[],
  createAsyncContainerFunc?: Function | Function[],
  createAsyncHemeraContainerFunc?: Function | Function[],
  preCreateServiceFunc?: Function | Function[],
  postCreateServiceFunc?: Function | Function[],
  updateContainerFunc?: any | any[],
  createPreference?: IPreferences | IPreferences[],
  overwritePreference?: IOverwritePreference | IOverwritePreference[],
  federation?: FederationServiceDeclaration | FederationServiceDeclaration[];
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
  public federation: FederationServiceDeclaration[];
  public createHemeraContainerFunc: Function[];
  public createAsyncContainerFunc: Function[];
  public createAsyncHemeraContainerFunc: Function[];
  public createDataSourceFunc: Function[];
  public preCreateServiceFunc: Function[];
  public postCreateServiceFunc: Function[];
  public disposeFunc: any[];
  public updateContainerFunc: any[];
  public beforeware: Function[];
  public middleware: Function[];
  public createPreference: IPreferences[];
  public overwritePreference: IOverwritePreference[];

  private services;
  private container;
  private hemeraContainer;
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
    this.postCreateServiceFunc = combine(arguments, arg => arg.postCreateServiceFunc);
    this.disposeFunc = combine(arguments, arg => arg.disposeFunc);

    this.federation =  combine(arguments, arg => arg.federation);
    this.createContainerFunc = combine(arguments, arg => arg.createContainerFunc);
    this.createHemeraContainerFunc = combine(arguments, arg => arg.createHemeraContainerFunc);
    this.createAsyncContainerFunc = combine(arguments, arg => arg.createAsyncContainerFunc);
    this.createAsyncHemeraContainerFunc = combine(arguments, arg => arg.createAsyncHemeraContainerFunc);
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

      await Promise.all(this.postCreateServiceFunc.map(async (createService) => await createService(this.container)));
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
    this.createContainerFunc.map(createModule => {
      this.container.load(createModule(options));
    });
    await Promise.all(this.createAsyncContainerFunc
      .map(async asyncCreateModule => {
        await this.container.loadAsync(asyncCreateModule(options));
      }));
    this.container.bind('IDefaultSettings').toConstantValue(this.getPreferences());
    this.container.bind('IDefaultSettingsObj').toConstantValue(this.getPreferencesObj());
    return this.container;
  }

  public async createHemeraContainers(options) {
    this.hemeraContainer = new Container();
    this.createHemeraContainerFunc.map(createModule => {
      this.hemeraContainer.load(createModule(options));
    });
    await Promise.all(this.createAsyncHemeraContainerFunc
      .map(async asyncCreateModule => {
        await this.hemeraContainer.loadAsync(asyncCreateModule(options));
      }));
    return this.hemeraContainer;
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

  public getPreferences(): IPreferncesTransformed[] {
    return transformPrefsToArray(this.getPreferencesObj());
  }

  public getPreferencesObj() {
    const defaultPrefs = merge(...this.createPreference);
    const overwritePrefs = merge(...this.overwritePreference);
    return getCurrentPreferences(defaultPrefs, overwritePrefs);
  }

}

export { Feature };
