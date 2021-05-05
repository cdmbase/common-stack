import { ComponentType } from 'react';
import { IRoute as IRouteProps, IRouteComponentProps } from '@common-stack/client-react';
import { NavigationHelpers, Route } from '@react-navigation/native';
import { History } from 'history';


export interface IScreen {
    key: string;
    name: string;
    component: ComponentType<any>;
    options: {
        routeMatchOpts: IRouteProps;
        sensitive?: boolean;
        title?: string;
        [key: string]: any;
    };
}


export interface IScreenComponentProps extends IRouteComponentProps {
    screen: Route<any>;
    navigation: NavigationHelpers<any, any>;
}

export interface INavigationProps {
    routes: IRouteProps[];
    history: History<any>;
    defaultTitle?: string;
    initialRouteName: string;
    screenOptions: any;
    [key: string]: any;
}

