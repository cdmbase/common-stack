import {Feature} from '../connector';
import 'jest';

describe('Preferences', function () {

    const featureWithRoleA = new Feature({
        addRoles: {
            'RoleA': {
                name: 'Role A',
                description: 'Role A',
                permissions: {
                    'org.permission.one': 'Allow',
                    'org.permission.two': 'Allow',
                    'org.permission.three': 'Allow',
                },
            },
        },
    });
    const secondFeatureWithRoleA = new Feature({
        addRoles: {
            'RoleA': {
                name: 'Role A',
                description: 'Role A Updated',
                permissions: {
                    'org.permission.three': 'Deny',
                    'org.permission.four': 'Allow',
                    'org.permission.five': 'Allow',
                },
            },
        },
    });
    const featureWithRoleB = new Feature({
        addRoles: {
            'RoleB': {
                name: 'Role B',
                description: 'Role B',
                permissions: {
                    'org.permission.one': 'Deny',
                    'org.permission.two': 'Deny',
                    'org.permission.three': 'Deny',
                },
            },
        },
    });

    it('Should add two different roles with permissions', () => {
        const feature = new Feature(featureWithRoleA, featureWithRoleB);
        const featureRoles = feature.getRoles();
        expect(featureRoles).toEqual([...featureWithRoleA.addRoles, ...featureWithRoleB.addRoles]);
    });

    it('Should add two same roles with permissions', () => {
        const feature = new Feature(featureWithRoleA, secondFeatureWithRoleA);
        const featureRoles = feature.getRoles();
        expect(featureRoles).toEqual([{
            'RoleA': {
                name: 'Role A',
                description: 'Role A Updated',
                permissions: {
                    'org.permission.one': 'Allow',
                    'org.permission.two': 'Allow',
                    'org.permission.three': 'Deny',
                    'org.permission.four': 'Allow',
                    'org.permission.five': 'Allow',
                },
            },
        }]);
    });

    it('Should overwrite permissions', () => {
        const overwritePermission = new Feature({
            modifyRolesPermissions: {
                'RoleB': {
                    permissions: {
                        'org.permission.three': 'Allow',
                        'org.permission.four': 'Deny',
                        'org.permission.five': 'Deny',
                        'org.permission.six': 'Deny',
                    },
                },
            },
        });


        const feature = new Feature(featureWithRoleB, overwritePermission);
        const featureRoles = feature.getRoles();
        expect(featureRoles).toEqual([
            {
                'RoleB': {
                    name: 'Role B',
                    description: 'Role B',
                    permissions: {
                        'org.permission.one': 'Deny',
                        'org.permission.two': 'Deny',
                        'org.permission.three': 'Allow',
                        'org.permission.four': 'Deny',
                        'org.permission.five': 'Deny',
                        'org.permission.six': 'Deny',
                    },
                },
            },
        ]);
    });
});
