import 'jest';
import {Feature} from '../connector';
import {merge} from 'lodash';

describe('Should Test GraphqlRoles registration in Feature class', () => {
    it('Should register rules from two different modules', () => {
        const rulesA = {
                QUERY: {
                    async getSomething() {
                        return {'a': false};
                    },
                },
                MUTATIONS: {
                    async doSomething () {
                        return {'a': false};
                    },
                },
                SUBSCRIPTIONS: {
                    async subscribeToSomething() {
                        return {'a': false};
                    },
                },
            };
        const featureA = new Feature({
            rules: rulesA,
        });
        const rulesB = {
                QUERY: {
                    async getSomethingElse() {
                        return {'a': false};
                    },
                },
                MUTATIONS: {
                    async doSomethingElse() {
                        return {'a': false};
                    },
                },
                SUBSCRIPTIONS: {
                    async subscribeToSomethingElse() {
                        return {'a': false};
                    },
                },
            };

        const featureB = new Feature({
            rules: rulesB,
        });
        const mergedFeatures = new Feature(featureA, featureB);
        expect(mergedFeatures.rules).toStrictEqual(merge(rulesA, rulesB));
    });
});
