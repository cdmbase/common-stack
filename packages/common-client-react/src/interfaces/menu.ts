

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
    priority?: number
}

export interface IMenuDataItem {
    /**
     * @name submenu
     */
    children?: IMenuDataItem[];
    /**
     * @name Hide child nodes in the menu
     */
    hideChildrenInMenu?: boolean;
    /**
     * @name hideSelf and children in menu
     */
    hideInMenu?: boolean;
    /**
     * @name Icon of the menu
     */
    icon?: React.ReactNode;
    /**
     * @name Internationalization key for custom menus
     */
    locale?: string | false;
    /**
     * @name The name of the menu
     */
    name?: string;
    /**
     * @name is used to calibrate the selected value, default is path
     */
    key?: string;
    /**
     * @name disable menu option
     */
    disabled?: boolean;
    /**
     * @name path
     */
    path?: string;
    /**
     * @name custom parent node
     * @description When this node is selected, the node of parentKeys is also selected
     */
    parentKeys?: string[];
    /**
     * @name hides itself and elevates child nodes to its level
     */
    flatMenu?: boolean;
    [key: string]: any;
}

export enum IMenuPosition {
    LOGO = 'LOGO',
    UPPER = 'UPPER',
    MIDDLE = 'MIDDLE',
    LOWER = 'LOWER',
    BOTTOM = 'BOTTOM',
}
