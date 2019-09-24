import { TestFeature as Feature } from './test-feature';
import { InMemoryCache } from 'apollo-cache-inmemory';
import 'jest';

const finalSettings = [
    {
        type: 'files',
        data: [
            {
                name: 'files.trimTrailingWhitespace',
                type: 'boolean',
                default: true,
                description: 'When enabled, will trim trailing whitespace when saving a file.',
                settings: 'both',
                enum: [],
                enumDescriptions: [],
                overridable: true,
            }, {
                name: 'files.autosave',
                type: 'boolean',
                default: false,
                description: 'new one',
                settings: 'both',
                enum: [],
                enumDescriptions: [],
                overridable: true,
            },
        ],
    },
];

describe('data id from object', function () {

    it('with connector', () => {
        const connector = new Feature({
            dataIdFromObject: {
                'IFileStat': (result: { resource: string, __typename: string }) => result.__typename + ':' + result.resource,
                'IContent': (result: { resource: string, __typename: string }) => result.__typename + ':' + result.resource,
                'IStreamContent': (result: { resource: string, __typename: string }) => result.__typename + ':' + result.resource,
                'IChangedContent': (result: { resource: string, __typename: string }) => result.__typename + ':' + result.resource,
            },
        });
        const connector2 = new Feature({
            dataIdFromObject: {
                'UserSettings': (result) => result.__typename,
            },
        });

        const feature = new Feature(connector, connector2);

        const __typenameRes = 'IFileStat';
        const resourceRes = 'resourceRes';
        const finalDataIdFromObject = feature.getDataIdFromObject({
            __typename: __typenameRes,
            resource: resourceRes,
        });

        expect(finalDataIdFromObject).toEqual(`${__typenameRes}:${resourceRes}`);
    });
    it('with apollo client', () => {
        const connector = new Feature({
            dataIdFromObject: {
                'IFileStat': (result: { resource: string, __typename: string }) => result.__typename + ':' + result.resource,
                'IContent': (result: { resource: string, __typename: string }) => result.__typename + ':' + result.resource,
                'IStreamContent': (result: { resource: string, __typename: string }) => result.__typename + ':' + result.resource,
                'IChangedContent': (result: { resource: string, __typename: string }) => result.__typename + ':' + result.resource,
            },
        });

        const feature = new Feature(connector);
        const cache = new InMemoryCache({ dataIdFromObject: (result) => feature.getDataIdFromObject(result) });
        
    });

});

