

export interface IMenuData {
    [key: string]: {
        name: any;
        position?: IMenuPosition;
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
    position: IMenuPosition;
    authority?: any;
    loading?: any;
    exact?: boolean;
    strict?: boolean;
    children?: IMenuItem[];
}

export enum IMenuPosition {
    LOGO= 'LOGO',
    UPPER = 'UPPER',
    MIDDLE = 'MIDDLE',
    LOWER = 'LOWER',
    BOTTOM = 'BOTTOM',
}
