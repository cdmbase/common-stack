
import { combineEpics, ofType, ActionsObservable } from 'redux-observable';
import 'jest';
import { Subject } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { AbstractFeature } from '../connector';

class TestFeature extends AbstractFeature {
    public getConfiguredMenus: () => {};

    public getDataIdFromObject: () => {};

    public getDataRoot: () => {};

    public getConfiguredRoutes: () => {};

    public getMenus: () => {};

    public getRoutes: () => {};

    public getWrappedRoot: () => {};

    public navItems: () => {};

    public navItemRight: () => {};

    public navItemsRight: () => {};

    public registerLanguages: () => {};
}

describe('epics', () => {
    xit('should combine epics', () => {
        const epic1 = (actions, store) =>
            actions.pipe(
                ofType('ACTION1'),
                map(action => ({ type: 'DELEGATED1', action, store })),
            );
        const epic2 = (actions, store) =>
            actions.pipe(
                ofType('ACTION2'),
                map(action => ({ type: 'DELEGATED2', action, store })),
            );

        const epic = combineEpics(
            epic1,
            epic2,
        );

        const reduxStore = { I: 'am', a: 'store' };
        const subject: any = new Subject();
        const initActions = new ActionsObservable(subject);
        const result = epic(initActions, reduxStore);
        const emittedActions = [];

        result.subscribe(emittedAction => emittedActions.push(emittedAction));
        subject.next({ type: 'ACTION1' });
        subject.next({ type: 'ACTION2' });

        expect(emittedActions).toMatchObject([
            { type: 'DELEGATED1', action: { type: 'ACTION1' }, store: reduxStore },
            { type: 'DELEGATED2', action: { type: 'ACTION2' }, store: reduxStore },
        ]);

    });

    it('should combine epics using features', () => {
        const epic1 = (actions, store) =>
            actions.pipe(
                ofType('ACTION1'),
                map(action => ({ type: 'DELEGATED1', action, store })),
            );
        const epic2 = (actions, store) =>
            actions.pipe(
                ofType('ACTION2'),
                map(action => ({ type: 'DELEGATED2', action, store })),
            );

        const module = new TestFeature({
            epic: [epic1, epic2],
        });
        const epic = combineEpics(
            ...module.epics,
        );

        const reduxStore = { I: 'am', a: 'store' };
        const subject: any = new Subject();
        const initActions = new ActionsObservable(subject);
        const result = epic(initActions, reduxStore);
        const emittedActions = [];

        result.subscribe(emittedAction => emittedActions.push(emittedAction));
        subject.next({ type: 'ACTION1' });
        subject.next({ type: 'ACTION2' });

        expect(emittedActions).toMatchObject([
            { type: 'DELEGATED1', action: { type: 'ACTION1' }, store: reduxStore },
            { type: 'DELEGATED2', action: { type: 'ACTION2' }, store: reduxStore },
        ]);

    });
});
