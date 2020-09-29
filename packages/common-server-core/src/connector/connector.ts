import {
    ConfigurationScope,
    IDirectiveOptions,
    IMongoMigration,
    IOverwritePreference,
    IPreferences,
    IPreferncesTransformed,
    IResolverOptions,
    IRoles,
    IWebsocketConfig,
} from '../interfaces';
import {castArray, groupBy, map, merge, union, without} from 'lodash';
import {Container} from 'inversify';
import {getCurrentPreferences, transformPrefsToArray} from '../utils';

export const featureCatalog: any = {};

const combine = (features, extractor): any =>
    without(union(...map(features, res => castArray(extractor(res)))), undefined);

export interface IFederationServiceOptions {
    port: number;
    config?: any; // for apollo-server
}

export type FederationServiceDeclaration = (options: IFederationServiceOptions) => Promise<void>;

/**
 * Feature Params that can be passed to Feature Module.
 */
export type FeatureParams<T = ConfigurationScope> = {
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
    preStartFunc?: Function | Function[],
    postStartFunc?: Function | Function[],
    microservicePreStartFunc?: Function | Function[],
    microservicePostStartFunc?: Function | Function[],
    addBrokerMainServiceClass?: Function | Function[],
    addBrokerClientServiceClass?: Function | Function[],
    createWebsocketConfig?: IWebsocketConfig | IWebsocketConfig[],
    updateContainerFunc?: any | any[],
    createPreference?: IPreferences<T> | IPreferences<T>[],
    /**
     * Roles to provide permissions to access resources.
     */
    addRoles?: IRoles<T> | IRoles<T>[],
    modifyRolesPermissions?: any | any[],
    overwritePreference?: IOverwritePreference | IOverwritePreference[],
    federation?: FederationServiceDeclaration | FederationServiceDeclaration[];
    dataIdFromObject?: Function | Function[],
    disposeFunc?: any | any[],
    beforeware?: any | any[],
    middleware?: any | any[],
    catalogInfo?: any | any[],
};

class Feature<T = ConfigurationScope> {
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
    public preStartFunc: Function[];
    public postStartFunc: Function[];
    public microservicePreStartFunc: Function[];
    public microservicePostStartFunc: Function[];
    public addBrokerMainServiceClass: Function[];
    public addBrokerClientServiceClass: Function[];
    public disposeFunc: any[];
    public updateContainerFunc: any[];
    public beforeware: Function[];
    public middleware: Function[];
    public createWebsocketConfig: IWebsocketConfig[];
    public createPreference: IPreferences<T>[];
    public addRoles: IRoles<T>[];
    public modifyRolesPermissions: Function[];
    public overwritePreference: IOverwritePreference[];
    public overwriteRole: IOverwritePreference[];
    public migrations?: Array<{ [id: string]: IMongoMigration }>;

    private services;
    private container;
    private hemeraContainer;
    private dataSources;

    constructor(feature?: FeatureParams<T>, ...features: Feature<T>[]) {
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
        this.preStartFunc = combine(arguments, arg => arg.preStartFunc);
        this.postStartFunc = combine(arguments, arg => arg.postStartFunc);
        this.microservicePreStartFunc = combine(arguments, arg => arg.microservicePreStartFunc);
        this.microservicePostStartFunc = combine(arguments, arg => arg.microservicePostStartFunc);
        this.addBrokerMainServiceClass = combine(arguments, arg => arg.addBrokerMainServiceClass);
        this.addBrokerClientServiceClass = combine(arguments, arg => arg.addBrokerClientServiceClass);
        this.disposeFunc = combine(arguments, arg => arg.disposeFunc);

        this.federation = combine(arguments, arg => arg.federation);
        this.migrations = combine(arguments, arg => arg.migrations);
        this.createContainerFunc = combine(arguments, arg => arg.createContainerFunc);
        this.createHemeraContainerFunc = combine(arguments, arg => arg.createHemeraContainerFunc);
        this.createAsyncContainerFunc = combine(arguments, arg => arg.createAsyncContainerFunc);
        this.createAsyncHemeraContainerFunc = combine(arguments, arg => arg.createAsyncHemeraContainerFunc);
        this.updateContainerFunc = combine(arguments, arg => arg.updateContainerFunc);
        this.createDataSourceFunc = combine(arguments, arg => arg.createDataSourceFunc);
        this.beforeware = combine(arguments, arg => arg.beforeware);
        this.middleware = combine(arguments, arg => arg.middleware);
        this.createWebsocketConfig = combine(arguments, arg => arg.createWebsocketConfig);
        this.createPreference = combine(arguments, arg => arg.createPreference);
        this.addRoles = combine(arguments, arg => arg.addRoles);
        this.modifyRolesPermissions = combine(arguments, arg => arg.modifyRolesPermissions);
        this.overwritePreference = combine(arguments, arg => arg.overwritePreference);
        this.overwriteRole = combine(arguments, arg => arg.overwriteRole);
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
            return merge({}, ...results, {...this.services});
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

    /**
     * Pre start action will be executed there.
     *
     */
    public async preStart<S = unknown>(options: S) {
        return await Promise.all(this.preStartFunc.map(async (preStart) => await preStart(this.container, options)));
    }

    /**
     * Post start actions will be executed here.
     */
    public async postStart<S = unknown>(options: S) {
        return await Promise.all(this.postStartFunc.map(async (postStart) => await postStart(this.container, options)));
    }

    /**
     * Pre start action will be executed there.
     *
     */
    public async microservicePreStart<S = unknown>(options: S) {
        return await Promise.all(this.microservicePreStartFunc.map(async (preStart) => await preStart(this.container, options)));
    }

    /**
     * Post start actions will be executed here.
     */
    public async microservicePostStart<S = unknown>(options: S) {
        return await Promise.all(this.microservicePostStartFunc.map(async (postStart) => await postStart(this.container, options)));
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
        // roles
        this.container.bind('IDefaultRoles').toConstantValue(this.getRoles());
        this.container.bind('IDefaultRolesObj').toConstantValue(this.getRolesObj());
        return this.container;
    }

    /**
     * Use createMicroserviceContainer
     * @param options
     * @deprecated
     */
    public async createHemeraContainers(options) {
        return this.createMicroserviceContainers(options);
    }

    /**
     * Creates container for the microservice
     *
     * @param options
     */
    public async createMicroserviceContainers(options) {
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

    public loadMainMoleculerService({container, broker, settings}: { container: Container, broker: any, settings: unknown }) {
        this.addBrokerMainServiceClass.map(serviceClass => broker.createService(serviceClass, {container, settings}));
    }

    public loadClientMoleculerService({container, broker, settings}: { container: Container, broker: any, settings: unknown }) {
        this.addBrokerClientServiceClass.map(serviceClass => broker.createService(serviceClass, {container, settings}));
    }

    public createDefaultPreferences() {
        return transformPrefsToArray(merge([], ...this.createPreference));
    }

    get beforewares(): any[] {
        return this.beforeware;
    }

    get middlewares(): any[] {
        return this.middleware;
    }

    public getPreferences<S = ConfigurationScope>(): IPreferncesTransformed<S>[] {
        return transformPrefsToArray<S>(this.getPreferencesObj());
    }

    public getRoles() {
        const grouped = groupBy([...this.addRoles, ...this.modifyRolesPermissions], (item) => {
            return Object.keys(item)[0];
        });
        return Object.keys(grouped).reduce((acc, key) => {
            const roles = grouped[key];
            const mergedRoles = roles.reduce((merged, curr) => {
                return {
                    ...merged,
                    ...curr[key],
                    permissions: {
                        // @ts-ignore
                        ...(merged.permissions || {} ),
                        ...curr[key].permissions,
                    },
                };
            }, {});
            return [...acc, {[key]: mergedRoles}];
        }, []);
    }

    public getRolesObj<S>() {
        const defaultPrefs: IPreferences<S>[] = merge([], ...this.addRoles);
        const overwritePrefs: IOverwritePreference[] = merge([], ...this.overwriteRole);
        return getCurrentPreferences<S>(defaultPrefs, overwritePrefs);
    }

    public getPreferencesObj<S>() {
        const defaultPrefs: IPreferences<S>[] = merge([], ...this.createPreference);
        const overwritePrefs: IOverwritePreference[] = merge([], ...this.overwritePreference);
        return getCurrentPreferences<S>(defaultPrefs, overwritePrefs);
    }

    public getWebsocketConfig() {
        return this.createWebsocketConfig.reduce((pre, curr) => {
            return merge(pre, curr);
        }, {});
    }

}

export {Feature};
