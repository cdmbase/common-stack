import * as React from 'react';
import SiderMenu from '@common-stack/components/lib/browser/components/SiderMenu';


const genMenu = {
    ['/dashboard']: { name: 'dashboard' },
    ['/dashboard/name']: { name: 'name' },
    ['/userinfo']: { name: 'userinfo' },
    ['/userinfo/:id']: { name: 'userinfo-id' },
    ['/userinfo/:id/info']: { name: 'user-info' },
};



export default ({ menuData, location }) => (
    <div>
        <SiderMenu
            menuData={menuData}
            location={location}
            isMobile={false}
            styles={{ sider: '' }}
        />
    </div>
);


