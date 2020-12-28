import { Feature } from '../connector';
import 'jest';
import { castArray, merge } from 'lodash';
import { config } from 'dotenv';
config({ path: process.env.ENV_FILE });

describe('Should Test Role Update functionality of Feature Class', () => {
    describe('Should Test Create Roles Functionality', () => {
        const featureWithRoleA = new Feature({
            rolesUpdate: {
                createRoles: [{
                    'RoleA': {
                        name: 'Role A',
                        description: 'Role A',
                        permissions: {
                        },
                    },
                    'RoleC': {
                        name: 'Role C',
                        description: 'Role C',
                        permissions: {
                        },
                    },
                }],
            },
        });
        const secondFeatureWithRoleA = new Feature({
            rolesUpdate: {
                overwriteRolesPermissions: [{
                    'RoleA': {
                        'org.permission.three': 'Deny',
                        'org.permission.four': 'Allow',
                        'org.permission.five': 'Allow',
                    },
                }],
            },
        });
        const featureWithRoleB = new Feature({
            rolesUpdate: {
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
                },
            },
        });

        it('Should add two different roles with permissions', () => {
            const feature = new Feature(featureWithRoleA, secondFeatureWithRoleA, featureWithRoleB);
            const featureRoles = feature.getRoles();
            const result = merge(
                featureWithRoleA.rolesUpdate.createRoles[0],
                featureWithRoleB.rolesUpdate.createRoles[0],
                {'RoleA': { permissions: { ...secondFeatureWithRoleA.rolesUpdate.overwriteRolesPermissions[0]['RoleA']}}}
            );
            expect(featureRoles).toEqual(result);
        });

        xit('Should add two same roles with permissions', () => {
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

        xit('Should overwrite permissions', () => {
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
                    },
                },
            });


            const feature = new Feature(overwritePermission, featureWithRoleB);
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
    xdescribe('Should test create roles and overwrite permissions', () => {
        it('Should Merge Roles n Permissions', () => {

        });
    });
});
