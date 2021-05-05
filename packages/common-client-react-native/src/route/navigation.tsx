import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { matchRoutes, Redirect } from 'react-router-config';
import { createHistoryNavigator } from './create-history-navigator';
import { matchPath, __RouterContext as RouterContext } from 'react-router';
import { INavigationProps } from '../interfaces';
import { flattenRoutes  } from './utils';

const { Navigator, Screen } = createHistoryNavigator();

export function Navigation(props: INavigationProps): JSX.Element {
    const { history, routes, defaultTitle, ...rest } = props;


    const initialRouteName = props.initial;


    const screenOptions = props.screeionOptions;

    useEffect(() => {
        function routeChangeHandler(location: any, action?: string) {
            const matchedRoutes = matchRoutes(props.routes, location.pathname);
            console.log('--ROUTE CHANGED', matchedRoutes);

        }
        routeChangeHandler(history.location, 'POP');
        return history.listen(routeChangeHandler);
    }, [history]);

    const screens = flattenRoutes(routes);

    if (__DEV__) {
        if (!screens || screens.length === 0) {
            return (
                <Navigator initialRouteName="notFound" history={history}>
                    <Screen
                        name="notFound"
                        component={() => (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#f4333c' }}>404</Text>
                                <Text style={{ fontSize: 14, color: '#f4333c' }}>Please implement an index page under the pages/ directory.</Text>
                            </View>
                        )}
                    />
                </Navigator>
            );
        }
    }

    const intialMatch = {
        path: initialRouteName,
        params: {},
        isExact: true,
        url: initialRouteName,
    };

    return (
        <Navigator initialRouteName={initialRouteName} history={history} screenOptions={screenOptions}>
            {screens.map(({ key, component: Component, options: { routeMatchOpts, title, ...options }, ...rest }, idx) => (
                <Screen
                    {...rest}
                    key={key || `screen_${idx}`}
                    options={{
                        ...options,
                        title: title || defaultTitle,
                    }}
                >
                    {(props) => {
                        const context = {
                            history,
                            location: history.location,
                            match: matchPath(history.location.pathname, routeMatchOpts) || intialMatch,
                        };
                        const newProps = {
                            ...rest,
                            ...context,
                            ...props,
                        };
                        return (
                            <RouterContext.Provider value={context}>
                                <Component {...newProps} />
                            </RouterContext.Provider>
                        )
                    }}

                </Screen>
            ))}
        </Navigator>
    )

}

