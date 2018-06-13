import { ContainerModule, interfaces, Container } from 'inversify';
import { Feature } from '../connector';

import 'jest';



describe('container merge test', function () {



    it('Should be able load container module', () => {

        const TYPES = {
            someType1: 'someType1',
            someType2: 'someType2',
            someType3: 'someType3',
            settings1: 'settings1',
            settings2: 'settings2',
        };

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


        const container = feature.createContainers({ settings1: 'settings1', settings2: 'settings2' });


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

    const service = feature.createService({ settings1: 'settings1', settings2: 'settings2' });

    
});
