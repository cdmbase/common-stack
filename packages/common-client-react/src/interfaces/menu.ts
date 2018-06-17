

export interface IMenuData {
    [key: string]: {
        name: any;
        icon?: any;
        authority?: any;
        exact?: boolean;
        strict?: boolean;
        [key: string]: any;
    };
}

export interface IMenuItem {
    path?: string;
    name: any;
    icon?: any;
    authority?: any;
    loading?: any;
    exact?: boolean;
    strict?: boolean;
    children?: IMenuItem[];
}
