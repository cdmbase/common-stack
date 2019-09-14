export interface IContextResolver {
    [propName: string]: (action: any) => Promise<any>;
}

export const contextMiddleware = (contextResolvers: any) => {
    return ({ dispatch, getState }) => next => action => {
        let act = action;
        let ctxPromise = Promise.resolve({});

        if (action['$dependencies'] && Array.isArray(action['$dependencies'])) {            
            let deps = action.$dependencies.map(dep => Promise.resolve(contextResolvers[dep].call(undefined, action)).then(value => ({ dep, value })));
            ctxPromise = Promise.all(deps) 
                .then((dependencies: any[]) => 
                    dependencies.reduce((acc, { dep, value }) => Object.assign(acc, { [dep]: value }), {}),
                );
        }

        ctxPromise.then(context => {
            act = action.$action || act;
            if (typeof act === 'function') {
                return act(dispatch, getState, context);
            }
    
            return next({ ...action, context });
        });
    };
};
