export const defaultSettings = {
    'files.trimTrailingWhitespace': {
        type: 'boolean',
        default: false,
        description: 'When enabled, will trim trailing whitespace when saving a file.',
        settings: 'both',
        enum: [],
        enumDescriptions: [],
        overridable: true,
    },
    'files.autosave': {
        type: 'boolean',
        default: false,
        description: 'Some Description',
        settings: 'both',
        enum: [],
        enumDescriptions: [],
    },
    'tree.trimTrailingWhitespace': {
        'one': false,
    },
};

export const userSettings = {
    'files.trimTrailingWhitespace.default': true,
    'tree.trimTrailingWhitespace.something': 'else',
    'tree.trimTrailingWhitespace.one': true,
};

export const prefRes = {
    'files.trimTrailingWhitespace': {
        type: 'boolean',
        default: true,
        description: 'When enabled, will trim trailing whitespace when saving a file.',
        settings: 'both',
        enum: [],
        enumDescriptions: [],
        overridable: true,
    },
    'files.autosave': {
        type: 'boolean',
        default: false,
        description: 'Some Description',
        settings: 'both',
        enum: [],
        enumDescriptions: [],
    },
    'tree.trimTrailingWhitespace': { one: false},
};

export const prefsArrRes = [
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
                description: 'Some Description',
                settings: 'both',
                enum: [],
                enumDescriptions: [],
            },
        ],
    }, {
        type: 'tree',
        data: [{ name: 'tree.trimTrailingWhitespace', one: false }],
    },
];

export const finalSettings = [
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

