import 'reflect-metadata';
import { ContainerModule, interfaces, Container, injectable, inject, tagged } from 'inversify';
import { Feature } from '../connector';

import 'jest';



describe('service merge test', function () {

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

    it('Should be able load context module', () => {

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

    it('Should be able load service by condition module', () => {

        interface Weapon { }

        class TaggedWarrior {

            private _primaryWeapon: Weapon;
            private _secondaryWeapon: Weapon;

            public constructor(
                @tagged('power', 1) primary: Weapon,
                @tagged('power', 2) secondary: Weapon) {

                this._primaryWeapon = primary;
                this._secondaryWeapon = secondary;
            }
            public debug() {
                return {
                    primaryWeapon: this._primaryWeapon,
                    secondaryWeapon: this._secondaryWeapon,
                };
            }
        }

        class DoubleTaggedWarrior {

            private _primaryWeapon: Weapon;
            private _secondaryWeapon: Weapon;

            public constructor(
                @tagged('power', 1) @tagged('distance', 1) primary: Weapon,
                @tagged('power', 2) @tagged('distance', 5) secondary: Weapon) {

                this._primaryWeapon = primary;
                this._secondaryWeapon = secondary;
            }
            public debug() {
                return {
                    primaryWeapon: this._primaryWeapon,
                    secondaryWeapon: this._secondaryWeapon,
                };
            }
        }

        class InvalidDecoratorUsageWarrior {

            private _primaryWeapon: Weapon;
            private _secondaryWeapon: Weapon;

            public constructor(
                primary: Weapon,
                secondary: Weapon) {

                this._primaryWeapon = primary;
                this._secondaryWeapon = secondary;
            }

            public test(a: string) { /*...*/ }

            public debug() {
                return {
                    primaryWeapon: this._primaryWeapon,
                    secondaryWeapon: this._secondaryWeapon,
                };
            }
        }

        // work in progress
    });

});
