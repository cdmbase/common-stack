import { getCurrentPreferences, transformPrefsToArray } from '../../utils';
import { Feature } from '../connector';
import 'jest';

interface RoleContribution {
    name: string;
    description: string;
    permissions: { [key: string]: any };
}
describe('Preferences', function () {


    it('Add Roles or Modify its permission', () => {
        const connector = new Feature({
            addRoles: {
                'RoleA': {
                    name: 'Role A',
                    description: 'Role A',
                    permissions: {
                        'org.permission.one': 'Allow',
                        'org.permission.two': 'Allow',
                        'org.permission.three': 'Allow',
                    }
                },
            },
        });
        const connector2 = new Feature({
            addRoles: {
                'RoleB': {
                    name: 'Role B',
                    description: 'Role B',
                    permissions: {
                        'org.permission.one': 'Deny',
                        'org.permission.two': 'Deny',
                        'org.permission.three': 'Deny',
                    }
                },
            },
        });

        const connector3 = new Feature({
            modifyRolesPermissions: {
                'RoleB': {
                    permissions: {
                        'org.permission.four': 'Deny',
                        'org.permission.five': 'Deny',
                        'org.permission.six': 'Deny',
                    }
                },
            },
        });


        const feature = new Feature(connector, connector2);
        const featureRoles = feature.getRoles();
        console.log('---FeatureRoles', featureRoles);
        // expect(featureRoles).toEqual(finalSettings);
    });
});
