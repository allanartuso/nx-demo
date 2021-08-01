import { ClickActionType, MenuItem } from '@demo/shared/ui-sidebar';

export const FOOTER_ITEMS: MenuItem[] = [
  {
    name: 'Logout',
    icon: 'logout',
    clickAction: ClickActionType.LOGOUT
  },
  {
    name: 'Collapse',
    icon: 'chevron_right',
    clickAction: ClickActionType.SIDE_BAR_TOGGLE
  }
];
