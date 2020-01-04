export interface IMongoMigration {
    up(): Promise<void>;
    down(): Promise<void>;
}
