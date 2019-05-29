function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply)
}

export const addToAction = ($action, extend: any) =>
    isFunction($action) 
        ? Object.assign({ $action }, extend) 
        : Object.assign(extend, $action);

export const sideAction = () => (action: any) => addToAction(action, { $side: true });
export const withContext = (...$dependencies: string[]) => (action: any) => addToAction(action, { $dependencies });

export const createSideAction = (action) => (...args) => sideAction()(action(...args));
export const createActionWithContext = (action, context) => (...args) => withContext(...context)(action(...args));
