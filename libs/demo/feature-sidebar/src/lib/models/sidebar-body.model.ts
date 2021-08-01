/*
  * MenuItem EXAMPLE:
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
  */

import { MenuItem } from '@demo/shared/ui-sidebar';

export const BODY_ITEMS: MenuItem[] = [
  {
    name: 'Home',
    icon: 'home',
    link: '/home'
  },
  {
    name: 'Users',
    icon: 'person',
    display: true,
    link: '/users'
  }
];
