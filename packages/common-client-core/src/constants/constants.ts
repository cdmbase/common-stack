

export const ClientTypes = {
    // common types
    Logger: Symbol.for('Logger'),
    ApolloClient: Symbol.for('ApolloClient'),
    InMemoryCache: Symbol.for('InMemoryCache'),
    UtilityClass: Symbol.for('UtilityClass'),
};

export const ElectronTypes = {
    MainWindow: Symbol.for('MainWindow'),
    AboutWindow: Symbol.for('AboutWindow'),
    TrayWindow: Symbol.for('TrayWindow'),
}