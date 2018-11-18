import { IFlag } from "../../../common";

export type UnifiedFlagRequest = IFlagGetRequest | IFlagSetRequest;

export interface IFlagSetRequest {
    value: any;
    key: string;
    type: string;
    scope?: string;
    metadata?: any;
}

export interface IFlagGetRequest {
    key?: string;
    scope?: string;
}

export interface IAbstractFlagManagement {
    set(request: IFlagSetRequest): Promise<IFlag>;
    get(request: IFlagGetRequest): Promise<IFlag>;
    delete(request: IFlagGetRequest): Promise<boolean>;
}

export interface IFlagStore extends IAbstractFlagManagement {}
export interface IFlagService extends IAbstractFlagManagement {}
