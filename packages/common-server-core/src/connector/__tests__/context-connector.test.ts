import { ContainerModule, interfaces, Container, AsyncContainerModule } from 'inversify';
import { Feature } from '../connector';
import {
    defaultSettings, userSettings, prefRes, prefsArrRes,
    finalSettings, convertedDefaultSettings,
} from './fixtures/preferenfces/common-settings';

import 'jest';


describe('context merge test', function () {
    const TYPES = {
        someType1: 'someType1',
        someType2: 'someType2',
        someType3: 'someType3',
        settings1: 'settings1',
        settings2: 'settings2',
    };

    it('Should be able load context module', async (done) => {

        const module1 =
            (settings) => new ContainerModule((bind: interfaces.Bind) => {
                bind<number>(TYPES.someType1).toConstantValue(1);
                bind<number>(TYPES.someType2).toConstantValue(2);
                bind<string>(TYPES.settings1).toConstantValue(settings.settings1);
            });

        const module2 =
            (settings) => new ContainerModule((bind: interfaces.Bind) => {
                bind<number>(TYPES.someType3).toConstantValue(3);
                bind<string>(TYPES.settings2).toConstantValue(settings.settings2);
            });

        const serviceFunc = (cont) => ({
            service1: cont.get(TYPES.someType1),
        });

        try {
            const feature = new Feature({
                createContainerFunc: [module1, module2],
                createServiceFunc: [serviceFunc],
            });
            const service = await feature.createServiceContext({ settings1: 'settings1', settings2: 'settings2' });
            const contextService = await service(null, null);
            expect(contextService.service1).toEqual(1);
            done();
        } catch (err) {
            console.error(err);
            expect(done.fail);
        }
    });

    it('Should be able to retrieve IDefaultSettings context module', async (done) => {

        const module1 =
            (settings) => new ContainerModule((bind: interfaces.Bind) => {
                bind<number>(TYPES.someType1).toConstantValue(1);
                bind<number>(TYPES.someType2).toConstantValue(2);
                bind<string>(TYPES.settings1).toConstantValue(settings.settings1);
            });

        const module2 =
            (settings) => new ContainerModule((bind: interfaces.Bind) => {
                bind<number>(TYPES.someType3).toConstantValue(3);
                bind<string>(TYPES.settings2).toConstantValue(settings.settings2);
            });

        const serviceFunc = (cont) => ({
            service1: cont.get(TYPES.someType1),
            settings: cont.get('IDefaultSettings'),
        });

        try {
            const feature = new Feature({
                createContainerFunc: [module1, module2],
                createServiceFunc: [serviceFunc],
                createPreference: defaultSettings,
            });
            const service = await feature.createServiceContext({ settings1: 'settings1', settings2: 'settings2' });
            const contextService = await service(null, null);
            expect(contextService.settings).toEqual(convertedDefaultSettings);
            done();
        } catch (err) {
            console.error(err);
            expect(done.fail);
        }
    });

    it('Should be able use async functions in container modules', async (done) => {

        const someAsyncFactory = () => new Promise<number>((res) => setTimeout(() => res(5), 100));
        let resutlVal;
        const module1 = () => new AsyncContainerModule(async (bind) => {
            resutlVal = await someAsyncFactory();
            bind<number>(TYPES.someType1).toConstantValue(resutlVal);
        });

        const module2 = () => new AsyncContainerModule(async (bind) => {
            bind<number>(TYPES.someType2).toConstantValue(2);
        });

        const serviceFunc = (cont) => ({
            service1: cont.get(TYPES.someType1),
        });

        try {
            const feature = new Feature({
                createAsyncContainerFunc: [module1, module2],
                createServiceFunc: [serviceFunc],
            });
            const service = feature.createServiceContext({ settings1: 'settings1', settings2: 'settings2' });

            const contextService = await service(null, null);
            expect(contextService.service1).toEqual(resutlVal);
            done();
        } catch (err) {
            done.fail(err);
        }
    });

    it('Should be able use async functions and retrieve IDefaultSettings', async (done) => {

        const someAsyncFactory = () => new Promise<number>((res) => setTimeout(() => res(5), 100));
        let resutlVal;
        const module1 = () => new AsyncContainerModule(async (bind) => {
            resutlVal = await someAsyncFactory();
            bind<number>(TYPES.someType1).toConstantValue(resutlVal);
        });

        const module2 = () => new AsyncContainerModule(async (bind) => {
            bind<number>(TYPES.someType2).toConstantValue(2);
        });

        const serviceFunc = (cont) => ({
            service1: cont.get(TYPES.someType1),
            settings: cont.get('IDefaultSettings'),
        });

        try {
            const feature = new Feature({
                createAsyncContainerFunc: [module1, module2],
                createServiceFunc: [serviceFunc],
                createPreference: defaultSettings,
            });
            const service = feature.createServiceContext({ settings1: 'settings1', settings2: 'settings2' });

            const contextService = await service(null, null);
            expect(contextService.settings).toEqual(convertedDefaultSettings);
            done();
        } catch (err) {
            done.fail(err);
        }
    });

});
