import { ConfigurationScope, IPreferencesData } from "./connector";


export interface IRoles<T = ConfigurationScope> {
    [key: string]: IPreferencesData<T>;
}

export interface IRoleUpdate<T> {
    createRoles?: IRoles<T>[] | IRoles<T>;
    overwriteRolesPermissions?: IRoles<T>[] | IRoles<T>;
}
