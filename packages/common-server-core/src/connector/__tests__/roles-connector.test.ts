import {Feature} from '../connector';
import 'jest';
import {castArray} from 'lodash';

describe('Preferences', function () {

    const featureWithRoleA = new Feature({
        rolesUpdate:   {
            createRoles: {
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
        },
    });
    const secondFeatureWithRoleA = new Feature({
        rolesUpdate:   {
            createRoles: {
            'RoleA': {
                name: 'Role A',
                description: 'Role A Updated',
                permissions: {
                    'org.permission.three': 'Deny',
                    'org.permission.four': 'Allow',
                    'org.permission.five': 'Allow',
                },
            },
        }},
    });
    const featureWithRoleB = new Feature({
        rolesUpdate:   {
            createRoles: {
            'RoleB': {
                name: 'Role B',
                description: 'Role B',
                permissions: {
                    'org.permission.one': 'Deny',
                    'org.permission.two': 'Deny',
                    'org.permission.three': 'Deny',
                },
            },
        }},
    });

    it('Should add two different roles with permissions', () => {
        const feature = new Feature(featureWithRoleA, featureWithRoleB);
        const featureRoles = feature.getRoles();
        expect(featureRoles).toEqual([...castArray(featureWithRoleA.rolesUpdate.createRoles),
            ...castArray(featureWithRoleB.rolesUpdate.createRoles)]);
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
            rolesUpdate: {
            overwriteRolesPermissions: {
                'RoleB': {
                    permissions: {
                        'org.permission.three': 'Allow',
                        'org.permission.four': 'Deny',
                        'org.permission.five': 'Deny',
                        'org.permission.six': 'Deny',
                    },
                },
            }},
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
