import { Schema, Document, Connection, Model } from 'mongoose';

import { IFlag, EFLagTypes, EFlagScopes } from '../../../../common';

export interface IFlagModel extends Document, IFlag {
    id: any;
}

const { Mixed } = Schema.Types;

const FlagSchema = new Schema({
    scope: { type: EFlagScopes.Default },
    key: { type: String, required: true },
    type: { type: String, default: EFLagTypes.String },
    value: { type: Mixed, required: true, default: '' },
});

export type FlagModelType = Model<IFlagModel>;
export const FlagModelFunc = (conn: Connection): FlagModelType => 
    conn.model<IFlagModel>('ApplicationFlag', FlagSchema);
