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
