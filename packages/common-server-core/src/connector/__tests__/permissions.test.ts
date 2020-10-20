import { getCurrentPreferences, transformPrefsToArray } from '../../utils';
import { Feature } from '../connector';
import { permissionContribution } from './fixtures/sample-roles-permissions/account-api/permission-contribution';
import 'jest';


describe('Preferences', function () {

    it('with connector', async() => {
        const connector = new Feature({
            addPermissions: {
                createPermissions: [permissionContribution]
            }
        });
        const output = connector.getPermissionPreferencesObj();
        // console.log('---Output', output);
        const container = await  connector.createContainers({});
        console.log('---output container', container.get('IDefaultPermissionsObj'))
    });
});
