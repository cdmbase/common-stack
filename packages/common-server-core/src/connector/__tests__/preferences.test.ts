import { getCurrentPreferences, transformPrefsToArray } from '../../utils';
import { Feature } from '../connector';
import 'jest';

const defaultSettings = {
    'files.trimTrailingWhitespace': {
        type: 'boolean',
        default: false,
        description: 'When enabled, will trim trailing whitespace when saving a file.',
        overridable: true,
        settings: 'both',
        enum: [],
        enumDescriptions: [],
    },
    'files.autosave': {
        type: 'boolean',
        default: false,
        description: 'Some Description',
        overridable: true,
        settings: 'both',
        enum: [],
        enumDescriptions: [],
    },
    'tree.trimTrailingWhitespace': {
        'one': false,
    },
};

const userSettings = {
    'files.trimTrailingWhitespace.default': true,
    'tree.trimTrailingWhitespace.something': 'else',
    'tree.trimTrailingWhitespace.one': true,
};

const prefRes = {
    'files.trimTrailingWhitespace': {
        type: 'boolean',
        default: true,
        description: 'When enabled, will trim trailing whitespace when saving a file.',
        overridable: true,
        settings: 'both',
        enum: [],
        enumDescriptions: [],
    },
    'files.autosave': {
        type: 'boolean',
        default: false,
        description: 'Some Description',
        overridable: true,
        settings: 'both',
        enum: [],
        enumDescriptions: [],
    },
    'tree.trimTrailingWhitespace': { one: true, something: 'else' },
};


const prefsArrRes = [
    {
        type: 'files',
        data: [
            {
                name: 'files.trimTrailingWhitespace',
                type: 'boolean',
                default: true,
                description: 'When enabled, will trim trailing whitespace when saving a file.',
                overridable: true,
                settings: 'both',
                enum: [],
                enumDescriptions: [],

            }, {
                name: 'files.autosave',
                type: 'boolean',
                default: false,
                description: 'Some Description',
                overridable: true,
                settings: 'both',
                enum: [],
                enumDescriptions: [],
            },
        ],
    }, {
        type: 'tree',
        data: [{ name: 'tree.trimTrailingWhitespace', one: true, something: 'else' }],
    },
];

const finalSettings = [
    {
        type: 'files',
        data: [
            {
                name: 'files.trimTrailingWhitespace',
                type: 'boolean',
                default: true,
                description: 'When enabled, will trim trailing whitespace when saving a file.',
                overridable: true,
                settings: 'both',
                enum: [],
                enumDescriptions: [],

            }, {
                name: 'files.autosave',
                type: 'boolean',
                default: false,
                description: 'new one',
                overridable: true,
                settings: 'both',
                enum: [],
                enumDescriptions: [],
            },
        ],
    },
];

describe('Preferences', function () {

    it('Preferences utils functions', async () => {
        const pref = getCurrentPreferences(defaultSettings, userSettings);
        expect(pref).toEqual(prefRes);
        const prefsArr = transformPrefsToArray(pref);
        expect(prefsArr).toEqual(prefsArrRes);
    });

    it('with connector', () => {
        const connector = new Feature({
            createPreference: {
                'files.trimTrailingWhitespace': {
                    type: 'boolean',
                    default: false,
                    description: 'When enabled, will trim trailing whitespace when saving a file.',
                    overridable: true,
                    settings: 'both',
                    enum: [],
                    enumDescriptions: [],
                },
            } as any,
        });
        const connector2 = new Feature({
            createPreference: {
                'files.autosave': {
                    type: 'boolean',
                    default: false,
                    description: 'Some Description',
                    overridable: true,
                    settings: 'both',
                    enum: [],
                    enumDescriptions: [],
                },
            } as any,
        });

        const connector3 = new Feature({
            overwritePreference: {
                'files.trimTrailingWhitespace.default': true,
            } as any,
        });
        const connector4 = new Feature({
            overwritePreference: {
                'files.autosave.description': 'new one',
            } as any,
        });

        const feature = new Feature(connector, connector2, connector3, connector4);
        const finalPreferences = feature.getPreferences();

        expect(finalPreferences).toEqual(finalSettings);
    });
});
