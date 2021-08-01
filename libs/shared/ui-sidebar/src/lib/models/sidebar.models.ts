import { AccessibleOrganizationDto } from '@demo/shared/acm/data-access/user-context';
import { IconName } from '@fortawesome/fontawesome-svg-core';

export interface MenuItem {
  name: string;
  icon?: IconName;
  link?: string;
  target?: string;
  group?: boolean;
  selected?: boolean;
  expanded?: boolean;
  display?: boolean;
  displayChildren?: boolean;
  children?: MenuItem[];
  clickAction?: ClickActionType;
}

export enum ClickActionType {
  LOGOUT = 'logout',
  SIDE_BAR_TOGGLE = 'sideBarToggle'
}

export interface OrganizationSelector {
  accessibleOrganizations: AccessibleOrganizationDto[];
  displaySelector: boolean;
  icon: IconName;
}
