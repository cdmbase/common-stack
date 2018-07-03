import { getCurrentPreferences, transformPrefsToArray } from '../../utils';
import { Feature } from '../connector';
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
                'IFileStat': (result) => result.__typename + ':' + result.resource,
                'IContent': (result) => result.__typename + ':' + result.resource,
                'IStreamContent': (result) => result.__typename + ':' + result.resource,
                'IChangedContent': (result) => result.__typename + ':' + result.resource,
            } as any,
        });
        const connector2 = new Feature({
            dataIdFromObject: {
                'UserSettings': (result) => result.__typename,
            } as any,
        });

        const feature = new Feature(connector, connector2);

        const __typenameRes = '__typenameRes';
        const resourceRes = 'resourceRes';
        const finalDataIdFromObject = feature.getDataIdFromObject({
            type: 'IFileStat',
            __typename: __typenameRes,
            resource: resourceRes,
        });

        expect(finalDataIdFromObject).toEqual(`${__typenameRes}:${resourceRes}`);
    });
});
