import { getCurrentPreferences, transformPrefsToArray } from '../../utils';
import { Feature } from '../connector';
import { defaultSettings, userSettings,  prefRes, prefsArrRes, finalSettings } from './fixtures/preferenfces/sample-settings';
import 'jest';


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
                    settings: 'both',
                    enum: [],
                    enumDescriptions: [],
                    overridable: true,
                },
            } as any,
        });
        const connector2 = new Feature({
            createPreference: {
                'files.autosave': {
                    type: 'boolean',
                    default: false,
                    description: 'Some Description',
                    settings: 'both',
                    enum: [],
                    enumDescriptions: [],
                    overridable: true,
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
