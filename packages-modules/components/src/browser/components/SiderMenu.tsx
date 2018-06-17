import * as React from 'react';
import { Link } from 'react-router-dom';
import * as H from 'history';
import { urlToList } from '../utils';
import { Layout, Menu, Icon } from 'antd';
import * as pathToRegexp from 'path-to-regexp';
const { Sider } = Layout;
const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon, styles = '') => {
    if (typeof icon === 'string' && icon.indexOf('http') === 0) {
        return < img src={icon} alt="icon" className={styles} />;
    } if (typeof icon === 'string') {
        return <Icon type={icon} />;
    }
    return icon;
};

/**
 * Recursively flatten  the data
 * [{path: string}, {path: string}] => {path, path2}
 * @param menu
 */
export const getFlatMenuKeys = menu =>
    menu.reduce((keys, item) => {
        keys.push(item.path);
        if (item.children) {
            return keys.concat(getFlatMenuKeys(item.children));
        }
        return keys;
    }, []);


/**
 * Find all matched menu keys based on paths
 * @param flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param paths: [/abc/ /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
    paths.reduce((matchKeys, path) => (
        matchKeys.concat(
            flatMenuKeys.filter(item => pathToRegexp(item).test(path)),
        )), []);

export namespace ISiderMenu {
    export interface CompProps {
        menuData: any;
        onCollapse?: any;
        isMobile?: boolean;
        Authorized?: any;
        collapsed?: boolean;
        logo?: any;
        styles?: {
            logo?: any;
            sider?: any;
            icon?: any;
        };
    }

    export interface StateProps {
        location: H.Location;
    }

    export interface CompState {
        openKeys?: any;
    }

    export type Props = CompProps & StateProps;
    export type State = CompState;
}
export default class SiderMenu extends React.PureComponent<ISiderMenu.Props, ISiderMenu.State> {

    private flatMenuKeys;
    private menus;

    constructor(props) {
        super(props);
        console.log(props);
        this.menus = props.menuData;
        this.flatMenuKeys = getFlatMenuKeys(props.menuData);
        this.state = {
            openKeys: this.getDefaultCollapsedSubMenus(props),
        };
    }
    public componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.setState({
                openKeys: this.getDefaultCollapsedSubMenus(nextProps),
            });
        }
    }

    /**
     * Convert pathname to openKeys
     * /list/search/articles => ['list', '/list/search']
     * @param props
     */
    public getDefaultCollapsedSubMenus(props) {
        const { location: { pathname } } = props || this.props;
        return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname));
    }

    /**
     * Judge whether it is http link.return or a Link
     * @memberOf SiderMenu
     */
    public getMenuItemPath = item => {
        const { styles } = this.props;
        const itemPath = this.conversionPath(item.path);
        const icon = getIcon(item.icon, styles.icon);
        const { target, name } = item;
        // Is it a http link
        if (/^https?:\/\//.test(itemPath)) {
            return (
                <a href={itemPath} target={target}>
                    {icon}
                    <span>{name}</span>
                </a>
            );
        }
        return (
            <Link
                to={itemPath}
                target={target}
                replace={itemPath === this.props.location.pathname}
                onClick={
                    this.props.isMobile
                        ? () => {
                            this.props.onCollapse(true);
                        }
                        : undefined
                }
            >
                {icon}
                <span>{name}</span>
            </Link>
        );
    }
    /**
     * get SubMenu or Item
     */
    public getSubMenuOrItem = item => {
        const { styles } = this.props;
        if (item.children && item.children.some(child => child.name)) {
            const childrenItems = this.getNavMenuItems(item.children);
            if (childrenItems && childrenItems.length > 0) {
                return (
                    <SubMenu
                        title={
                            item.icon ? (
                                <span>
                                    {getIcon(item.icon, styles.icon)}
                                    <span>{item.name}</span>
                                </span>
                            ) : (
                                    item.name
                                )
                        }
                        key={item.path}
                    >
                        {childrenItems}
                    </SubMenu>
                );
            }
            return null;
        } else {
            return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
        }
    }
    /**
     * @memberof SiderMenu
     */
    public getNavMenuItems = menusData => {
        if (!menusData) {
            return [];
        }
        return menusData.filter(item => item.name && !item.hideInMenu)
            .map(item => {
                // make dom
                const ItemDom = this.getSubMenuOrItem(item);
                return this.checkPermissionItem(item.authority, ItemDom);
            })
            .filter(item => item);
    }

    // Get the currently selected menu
    public getSelectedMenuKeys = () => {
        const { location: { pathname } } = this.props;
        return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname));
    }
    // conversion Path
    public conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        } else {
            return `/${path || ''}`.replace(/\/+/g, '/');
        }
    }
    // permission to check
    public checkPermissionItem = (authority, ItemDom) => {
        if (this.props.Authorized && this.props.Authorized.check) {
            const { check } = this.props.Authorized;
            return check(authority, ItemDom);
        }
        return ItemDom;
    }
    public isMainMenu = key => {
        return this.menus.some(item => key && (item.key === key || item.path === key));
    }
    public handleOpenChange = openKeys => {
        const lastOpenKey = openKeys[openKeys.length - 1];
        const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
        this.setState({
            openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
        });
    }

    public render() {
        const { logo, collapsed, onCollapse, styles } = this.props;
        const { openKeys } = this.state;
        // Don't show popup menu when it is been collapsed
        const menuProps = collapsed ? {} : { openKeys };
        // If pathname can't match, use the nearest parent's key
        let selectedKeys = this.getSelectedMenuKeys();
        if (!selectedKeys.length) {
            selectedKeys = [openKeys[openKeys.length - 1]];
        }

        return (
            <Sider
                trigger={null}
                collapsible={true}
                collapsed={collapsed}
                breakpoint="lg"
                onCollapse={onCollapse}
                width={256}
                className={styles.sider}
            >
                <div className={styles.logo} key="logo">
                    <Link to="/">
                        <img src={logo} alt="logo" />
                        <h1>Ant Design Pro</h1>
                    </Link>
                </div>
                <Menu
                    key="Menu"
                    theme="dark"
                    mode="inline"
                    {...menuProps}
                    onOpenChange={this.handleOpenChange}
                    selectedKeys={selectedKeys}
                    style={{ padding: '16px 0', width: '100%' }}
                >
                    {this.getNavMenuItems(this.menus)}
                </Menu>
            </Sider>
        );
    }

}

