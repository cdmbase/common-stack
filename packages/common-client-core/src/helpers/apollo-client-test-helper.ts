import { ApolloClient, ApolloClientOptions, InMemoryCache } from '@apollo/client';
import { interfaces } from 'inversify';
import { logger } from '@cdm-logger/client';
import { IFeature } from '../interfaces';
import { ClientTypes } from '../constants';

class UtilityClass {
    constructor(private modules) {
    }
    public getCacheKey(storeObj) {
        return this.modules.getDataIdFromObject(storeObj);
    }
}


/**
 * Helper method to produce ApolloClient and Services from the feeded Feature Module.
 * @param modules 
 */
export const apolloClientHelper = (modules: IFeature) => {
    const clientState = modules.getStateParams({ resolverContex: () => modules.createService({}, {}) });

    const dataIdFromObject = (result) => modules.getDataIdFromObject(result);
    const cache = new InMemoryCache({
        dataIdFromObject,
        possibleTypes: clientState.possibleTypes
    });

    const schema = ``;

    const params: ApolloClientOptions<any> = {
        cache,
        queryDeduplication: true,
        typeDefs: schema.concat(<string>clientState.typeDefs),
        resolvers: clientState.resolvers as any,
    };
    const client = new ApolloClient(params);
    cache.writeData({
        data: {
            ...clientState.defaults,
        },
    });


    const utility = new UtilityClass(modules);

    // additional bindings to container
    const container: interfaces.Container = modules.createContainers({});
    container.bind(ClientTypes.Logger).toConstantValue(logger);
    container.bind(ClientTypes.UtilityClass).toConstantValue(utility);
    container.bind(ClientTypes.ApolloClient).toConstantValue(client);
    container.bind(ClientTypes.InMemoryCache).toConstantValue(cache);
    const services = modules.createService({}, {});
    (client as any).container = services;


    return {
        client,
        dataIdFromObject,
        services,
        container,
    }
}



