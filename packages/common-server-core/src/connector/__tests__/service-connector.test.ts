import { ContainerModule, interfaces, Container } from 'inversify';
import { Feature } from '../connector';

import 'jest';



describe('service merge test', function () {

    it('Should be able load context module', () => {

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


        const serviceFunc = (cont) => ({
            service1: cont.get(TYPES.someType1),
        });
        const feature = new Feature({
            createContainerFunc: [module1, module2],
            createServiceFunc: [serviceFunc],
        });


        const service = feature.createService({ settings1: 'settings1', settings2: 'settings2' });
        
        expect(service.service1).toEqual(1);


    });

});
