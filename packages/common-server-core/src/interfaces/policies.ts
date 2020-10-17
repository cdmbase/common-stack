import { IPreferences } from "./connector";


export interface IAddPolicies<T> {
    createPolicies?: IPreferences<T>[] | IPreferences<T>;
    overwritePolicies?: IPreferences<T>[] | IPreferences<T>;
}
