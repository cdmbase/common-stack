import * as mongoose from 'mongoose';

export interface IMongoDBSettings {
    mongoConnection: mongoose.Connection;
}
export interface IMongoOptions {
    collectionName?: string;
    sessionCollectionName?: string;
    timestamps?: {
        createdAt: string;
        updatedAt: string;
    };
    convertUserIdToMongoObjectId?: boolean;
    convertSessionIdToMongoObjectId?: boolean;
    caseSensitiveUserName?: boolean;
    idProvider?: (() => string | Object);
    dateProvider?: (date?: Date) => any;
}
