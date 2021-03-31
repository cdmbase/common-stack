import { getFlatMenus, transformRoute} from '@umijs/route-utils';

const routes = [
    {
      path: '/welcome',
      name: 'welcome',
      exact: true,
      unaccessible: false,
    },
    {
      path: '/admin',
      name: 'admin',
      access: 'canAdmin',
      routes: [
        {
          path: '/admin/sub-page',
          name: 'sub-page',
          exact: true,
          unaccessible: false,
        },
      ],
    },
    {
      name: 'list.table.result',
      path: '/list/:id',
      exact: true,
      unaccessible: false,
    },
    {
      name: 'list.table-list',
      path: '/list',
      exact: true,
      unaccessible: false,
    },
    { path: '/', redirect: '/welcome', exact: true, unaccessible: false },
  ];
  
  const {menuData} = transformRoute(routes, true, ({ id }) => {
    if (id ==='menu.list.table-list') return'query table';
    if (id ==='menu.list.table.result') return'Data details';
    if (id ==='menu.admin') return'Admin page';
    if (id ==='menu.admin.sub-page') return'Secondary management page';
    if (id ==='menu.welcome') return'welcome';
    return id;
  });

  console.log('---Menu Data', menuData);
  
  describe('getFlatMenus', () => {

    it('normal', () => {
        const flatMenus = getFlatMenus(menuData);
        console.log('--flatMenus', flatMenus)
        expect(Object.keys(flatMenus).length).toEqual(5);
        expect(flatMenus['/list'].name).toEqual('Inquiry Form');
        expect(flatMenus).toMatchSnapshot();
      });
  
    it('no has ket', () => {
      const noHasKeyData = [
        {
          path: '/welcome',
          name: '欢迎',
          exact: true,
          unaccessible: false,
          locale: 'menu.welcome',
          key: '/welcome',
          routes: null,
          pro_layout_parentKeys: [],
          children: undefined,
        },
        {
          path: '/welcome',
          name: '欢迎',
          key: '/admin/welcome',
          exact: true,
          unaccessible: false,
          locale: 'menu.welcome',
          routes: null,
          children: undefined,
        },
        {
          path: '/admin',
          name: '管理页',
          access: 'canAdmin',
          routes: null,
          locale: 'menu.admin',
          pro_layout_parentKeys: [],
        },
      ];
      const flatMenus = getFlatMenus(noHasKeyData);
      expect(Object.keys(flatMenus).length).toEqual(2);
    });
  });