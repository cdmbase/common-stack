import * as React from 'react';
import 'jest';
import {Feature} from '../connector';
import {IReactFeature} from '../interfaces';

describe('Test the registration and retrieval of React Slot Fill Components', () => {
    const featureA = new Feature({
        componentFillPlugins: [
            {
              name: 'test-1',
              render: () => (<p>Test 1</p>),
            },
            {
              name: 'test-2',
              render: () => (<p>Test 2</p>),
            },
            {
              name: 'test-3',
              render: () => (<p>Test 3</p>),
            },
        ],
    } as unknown as IReactFeature);

    const featureB = new Feature({
        componentFillPlugins: [
            {
                name: 'test-4',
                render: () => (<p>Test 4</p>),
            },
            {
                name: 'test-5',
                render: () => (<p>Test 5</p>),
            },
            {
                name: 'test-6',
                render: () => (<p>Test 6</p>),
            },
        ],
    } as unknown as IReactFeature);

    test('Should merge all Fills', () => {
        const finalFeature = new Feature(featureA, featureB);
        const mergedFills = finalFeature.getComponentFillPlugins();
        expect(mergedFills.length).toEqual(6);
        mergedFills.forEach(i => expect(typeof i).toEqual('object'));
        mergedFills.forEach(i => expect(typeof i.render).toEqual('function'));
    });
});
