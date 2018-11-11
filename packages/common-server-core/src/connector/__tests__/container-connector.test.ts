import { ContainerModule, interfaces, Container, AsyncContainerModule } from 'inversify';
import { Feature } from '../connector';
import { defaultSettings, convertedDefaultSettings } from './fixtures/preferenfces/sample-settings';
import 'jest';



describe('container merge test', function () {

    const TYPES = {
        someType1: 'someType1',
        someType2: 'someType2',
        someType3: 'someType3',
        settings1: 'settings1',
        settings2: 'settings2',
    };

    it('Should be able load container module', async () => {



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

        const feature = new Feature({
            createContainerFunc: [module1, module2],
        });


        const container = await feature.createContainers({ settings1: 'settings1', settings2: 'settings2' });


        const values1 = container.get(TYPES.someType1);
        const values2 = container.get(TYPES.someType2);
        const values3 = container.get(TYPES.someType3);
        const settings1 = container.get(TYPES.settings1);
        const settings2 = container.get(TYPES.settings2);

        expect(values1).toEqual(1);
        expect(values2).toEqual(2);
        expect(values3).toEqual(3);
        expect(settings1).toEqual('settings1');
        expect(settings2).toEqual('settings2');

    });


    it('Should be able retrieve IDefaultSettings', async () => {


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

        const feature = new Feature({
            createContainerFunc: [module1, module2],
            createPreference: defaultSettings,
        });

        const container = await feature.createContainers({ settings1: 'settings1', settings2: 'settings2' });
        const preferencesSettings = container.get('IDefaultSettings');
        expect(preferencesSettings).toEqual(convertedDefaultSettings);
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
            const container = await feature.createContainers({ settings1: 'settings1', settings2: 'settings2' });

            const service1 = container.get(TYPES.someType1);
            expect(service1).toEqual(resutlVal);
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

        try {
            const feature = new Feature({
                createAsyncContainerFunc: [module1, module2],
                createPreference: defaultSettings,
            });
            const container = await feature.createContainers({ settings1: 'settings1', settings2: 'settings2' });

            const service1 = container.get('IDefaultSettings');
            expect(service1).toEqual(convertedDefaultSettings);
            done();
        } catch (err) {
            done.fail(err);
        }
    });
});
