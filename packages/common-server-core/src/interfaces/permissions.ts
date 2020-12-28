import { IPreferences } from "./connector";


export interface IAddPermissions<T> {
    createPermissions?: IPreferences<T>[] | IPreferences<T>;
    overwritePermissions?: IPreferences<T>[] | IPreferences<T>;
}

