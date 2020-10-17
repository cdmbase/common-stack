import {
    ConfigurationScope,
    IDirectiveOptions,
    IMongoMigration,
    IOverwritePreference,
    IPreferences,
    IResolverOptions,
    IRoles,
    IWebsocketConfig,
    IGraphqlShieldRules,
    IAddPermissions,
    IAddPolicies,
} from '../interfaces';
import { logger } from '@cdm-logger/server';
import { castArray, groupBy, map, merge, union, without } from 'lodash';
import { Container } from 'inversify';
import { getCurrentPreferences, transformPrefsToArray } from '../utils';
import { IRoleUpdate } from '../interfaces/roles';
export const featureCatalog: any = {};

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
     * Permissions Preferences
     */
    addPermissions?: IAddPermissions<T>,
    /**
     * Policies Preferences
     */
    addPolicies?: IAddPolicies<T>,
    /**
     * Roles to provide permissions to access resources.
     */
    rolesUpdate?: IRoleUpdate<T>,
    overwritePreference?: IOverwritePreference | IOverwritePreference[],
    federation?: FederationServiceDeclaration | FederationServiceDeclaration[];
    dataIdFromObject?: Function | Function[],
    disposeFunc?: any | any[],
    beforeware?: any | any[],
    middleware?: any | any[],
    catalogInfo?: any | any[],
    /**
     *  Graphql shields rules, a graphql middleware for authorization
     *  based on defined permissions
     */
    rules?: IGraphqlShieldRules;
};



const combine = <T>(features: FeatureParams<T>[], extractor): any =>
    without(union(...map(features, (res: FeatureParams<T>) => castArray(extractor(res)))), undefined);

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
    public addPermissions?: IAddPermissions<T>;
    public addPolicies: IAddPolicies<T>;
    public rolesUpdate: IRoleUpdate<T>;
    public overwritePreference: IOverwritePreference[];
    public overwriteRole: IOverwritePreference[];
    public migrations?: Array<{ [id: string]: IMongoMigration }>;
    private _rules: IGraphqlShieldRules[];

    private services;
    private container;
    private hemeraContainer;
    private dataSources;

    constructor(feature?: FeatureParams<T>, ...features: Feature<T>[]) {
        const args: FeatureParams<T>[] = [feature, ...features as unknown as FeatureParams<T>[]];
        combine<T>(args, arg => arg.catalogInfo).forEach(info =>
            Object.keys(info).forEach(key => (featureCatalog[key] = info[key])),
        );
        this.schema = combine<T>(args, (arg: FeatureParams<T>) => arg.schema);
        this.createDirectivesFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.createDirectivesFunc);
        this.createResolversFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.createResolversFunc);
        this.createContextFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.createContextFunc);
        this.createServiceFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.createServiceFunc);
        this.preCreateServiceFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.preCreateServiceFunc);
        this.postCreateServiceFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.postCreateServiceFunc);
        this.preStartFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.preStartFunc);
        this.postStartFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.postStartFunc);
        this.microservicePreStartFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.microservicePreStartFunc);
        this.microservicePostStartFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.microservicePostStartFunc);
        this.addBrokerMainServiceClass = combine<T>(args, (arg: FeatureParams<T>) => arg.addBrokerMainServiceClass);
        this.addBrokerClientServiceClass = combine<T>(args, (arg: FeatureParams<T>) => arg.addBrokerClientServiceClass);
        this.disposeFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.disposeFunc);

        this.federation = combine<T>(args, (arg: FeatureParams<T>) => arg.federation);
        this.migrations = combine<T>(args, (arg: FeatureParams<T>) => arg);
        this.createContainerFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.createContainerFunc);
        this.createHemeraContainerFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.createHemeraContainerFunc);
        this.createAsyncContainerFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.createAsyncContainerFunc);
        this.createAsyncHemeraContainerFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.createAsyncHemeraContainerFunc);
        this.updateContainerFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.updateContainerFunc);
        this.createDataSourceFunc = combine<T>(args, (arg: FeatureParams<T>) => arg.createDataSourceFunc);
        this.beforeware = combine<T>(args, (arg: FeatureParams<T>) => arg.beforeware);
        this.middleware = combine<T>(args, (arg: FeatureParams<T>) => arg.middleware);
        this.createWebsocketConfig = combine<T>(args, (arg: FeatureParams<T>) => arg.createWebsocketConfig);
        this.createPreference = combine<T>(args, (arg: FeatureParams<T>) => arg.createPreference);
        this.addPermissions = combine<T>(args, (arg: FeatureParams<T>) => arg.addPermissions);
        this.addPermissions = {
            createPermissions: combine<T>(args, (arg: FeatureParams<T>) => arg.addPermissions &&
                arg.addPermissions.createPermissions),
            overwritePermissions: combine<T>(args, (arg: FeatureParams<T>) => arg.addPermissions &&
                arg.addPermissions.overwritePermissions),
        };
        this.addPolicies = {
            createPolicies: combine<T>(args, (arg: FeatureParams<T>) => arg.addPolicies &&
                arg.addPolicies.createPolicies),
            overwritePolicies: combine<T>(args, (arg: FeatureParams<T>) => arg.addPolicies &&
                arg.addPolicies.overwritePolicies),
        };
        this.rolesUpdate = {
            createRoles: combine<T>(args, (arg: FeatureParams<T>) => arg.rolesUpdate &&
                arg.rolesUpdate.createRoles),
            overwriteRolesPermissions: combine<T>(args, (arg: FeatureParams<T>) => arg.rolesUpdate &&
                arg.rolesUpdate.overwriteRolesPermissions),
        };
        this.overwritePreference = combine<T>(args, (arg: FeatureParams<T>) => arg.overwritePreference);
        this._rules = combine<T>(args, (arg: FeatureParams<T>) => arg.rules);
        // this.overwriteRole = combine<T>(args, (arg: FeatureParams<T>) => arg.overwriteRole);
    }

    get rules(): IGraphqlShieldRules {
        return this._rules.reduce((acc: IGraphqlShieldRules, curr) => {
            return merge(acc, curr) as IGraphqlShieldRules;
        }, {}) as IGraphqlShieldRules;
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
        // permissions
        this.container.bind('IDefaultPermissions').toConstantValue(this.getPermissionPreferences());
        this.container.bind('IDefaultPermissionsObj').toConstantValue(this.getPermissionPreferencesObj());
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

    public loadMainMoleculerService({ container, broker, settings }: { container: Container, broker: any, settings: unknown }) {
        this.addBrokerMainServiceClass.map(serviceClass => broker.createService(serviceClass, { container, settings }));
    }

    public loadClientMoleculerService({ container, broker, settings }: { container: Container, broker: any, settings: unknown }) {
        this.addBrokerClientServiceClass.map(serviceClass => broker.createService(serviceClass, { container, settings }));
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

    public getPreferences<S = ConfigurationScope>(): IPreferences<S>[] {
        return transformPrefsToArray<S>(this.getPreferencesObj());
    }

    public getPreferencesObj<S>() {
        const defaultPrefs: IPreferences<S>[] = merge([], ...this.createPreference);
        const overwritePrefs: IOverwritePreference[] = merge([], ...this.overwritePreference);
        return getCurrentPreferences<S>(defaultPrefs, overwritePrefs);
    }

    public getPermissionPreferences<T = ConfigurationScope>(): IPreferences<T>[] {
        return transformPrefsToArray<T>(this.getPermissionPreferencesObj());
    }

    public getPermissionPreferencesObj<T>() {
        const { createPermissions = [], overwritePermissions = []} = this.addPermissions;
        const defaultPrefs: IPreferences<T>[] = merge([], ...castArray(createPermissions));
        const overwritePrefs: IOverwritePreference[] = merge([], ...castArray(overwritePermissions));
        return getCurrentPreferences<T>(defaultPrefs, overwritePrefs);
    }

    public getPolicyPreferences<T = ConfigurationScope>(): IPreferences<T>[] {
        return transformPrefsToArray<T>(this.getPolicyPreferencesObj());
    }

    public getPolicyPreferencesObj<T>() {
        const { createPolicies = [], overwritePolicies = []} = this.addPolicies;
        const defaultPrefs: IPreferences<T>[] = merge([], ...castArray(createPolicies));
        const overwritePrefs: IOverwritePreference[] = merge([], ...castArray(overwritePolicies));
        return getCurrentPreferences<T>(defaultPrefs, overwritePrefs);
    }

    public getRoles(): IRoles[] {
        const { createRoles, overwriteRolesPermissions } = this.rolesUpdate;
        const grouped = groupBy([...castArray(createRoles), ...castArray(overwriteRolesPermissions)], (item) => {
            return Object.keys(item)[0];
        });
        logger.trace('-- Grouped Roles ---', grouped);
        // Iterating Object with distinctive roles as keys
        return Object.keys(grouped).reduce((acc, key) => {
            const roles = grouped[key];
            logger.trace(`-- Merging Role  ---`, key);
            const mergedRoles = roles.reduce((merged, curr) => {
                return {
                    ...merged,
                    ...curr[key],
                    permissions: {
                        ...(merged.permissions || {}),
                        ...curr[key].permissions,
                    },
                };
            }, {});
            logger.trace(' --- Merged Role ---', mergedRoles);
            return [...acc, { [key]: mergedRoles }];
        }, []);
    }

    public getRolesObj<S>() {
        const { createRoles } = this.rolesUpdate;
        const defaultPrefs: IPreferences<S>[] = merge([], ...castArray(createRoles));
        const overwritePrefs: IOverwritePreference[] = merge([], ...castArray(createRoles));
        return getCurrentPreferences<S>(defaultPrefs, overwritePrefs);
    }

    public getWebsocketConfig() {
        return this.createWebsocketConfig.reduce((pre, curr) => {
            return merge(pre, curr);
        }, {});
    }

}

export { Feature };
