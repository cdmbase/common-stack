export interface IDatabaseMigration {
    /**
     * ID of the migration, and it should be changed inorder to overwrite previous migration
     */
    id: string;
    up?(): Promise<void>;
    down?(): Promise<void>;
}

