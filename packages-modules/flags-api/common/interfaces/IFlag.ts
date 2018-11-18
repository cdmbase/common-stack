import { EFLagTypes } from "../constants";

export interface IFlag {
    key: string;
    value: string;
    scope: string;
    type: EFLagTypes;

    createdAt?: string;
    updatedAt?: string;
}