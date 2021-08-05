export interface MenuItem {
  name: string;
  icon?: string;
  link?: string;
  group?: boolean;
  selected?: boolean;
  expanded?: boolean;
  display?: boolean;
  displayChildren?: boolean;
  hover?: boolean;
  children?: MenuItem[];
  clickAction?: ClickActionType;
}

export interface MenuHeader {
  logo: string;
  alt: string;
  name: string;
  shortName: string;
}

export enum ClickActionType {
  LOGOUT = 'logout',
  SIDE_BAR_TOGGLE = 'sideBarToggle'
}

/*
* MenuItem EXAMPLE:

const bodyItems = [
   {
    name: 'Members',
    icon: 'badge',
    group: true
  },
  {
    name: 'contacts',
    icon: 'person',
    display: true,
    children: [
      {
        name: 'contacts',
        icon: 'person',
        link: 'contacts',
        display: true,
        children: [
          { name: 'members', icon: 'contact_mail', link: 'members' },
          { name: 'permissions', icon: 'person', link: 'permissions' },
          { name: 'restrictions', icon: 'lock', link: 'restrictions' }
        ]
      },
      {
        name: 'addresses',
        icon: 'mail',
        link: 'addresses'
      }
    ]
  }
]

*/
