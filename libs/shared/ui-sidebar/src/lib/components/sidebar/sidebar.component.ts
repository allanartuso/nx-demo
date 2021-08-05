import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClickActionType, MenuHeader, MenuItem } from '../../models/sidebar.models';

@Component({
  selector: 'demo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() expanded = false;
  @Input() showLogout = false;
  @Input() header: MenuHeader;
  @Input() bodyItems: MenuItem[] = [];
  @Input() set footerItems(footerItems: MenuItem[]) {
    const items = [...footerItems];

    if (this.showLogout) {
      items.push({
        name: 'Logout',
        icon: 'logout',
        clickAction: ClickActionType.LOGOUT
      });
    }

    this._footerItems = [
      ...items,
      {
        name: 'Collapse',
        icon: 'chevron_right',
        clickAction: ClickActionType.SIDE_BAR_TOGGLE
      }
    ];
  }
  get footerItems(): MenuItem[] {
    return this._footerItems;
  }
  private _footerItems: MenuItem[] = [];

  @Output() logout = new EventEmitter<void>();
  @Output() menuItemClicked = new EventEmitter<MenuItem>();

  onClosingSidebar(): void {
    for (const menuItem of [...this.bodyItems, ...this.footerItems]) {
      this.hideChildren(menuItem);
    }
  }

  onMenuItemClicked(item: MenuItem): void {
    switch (item.clickAction) {
      case ClickActionType.LOGOUT:
        this.logout.emit();
        break;
      case ClickActionType.SIDE_BAR_TOGGLE:
        this.expanded = !this.expanded;
        break;
    }
    this.menuItemClicked.emit(item);
  }

  onMenuItemHoveredOn(menuItem: MenuItem): void {
    if (!this.expanded) {
      menuItem.displayChildren = true;
    }

    if (!menuItem.group) {
      menuItem.hover = true;
    }
  }

  onMenuItemHoveredOff(menuItem: MenuItem): void {
    if (!this.expanded) {
      menuItem.displayChildren = false;
    }
    if (!menuItem.group) {
      menuItem.hover = false;
    }
  }

  onMenuItemToggled(menuItem: MenuItem): void {
    menuItem.displayChildren = !menuItem.displayChildren;
  }

  private hideChildren(menuItem: MenuItem): void {
    menuItem.displayChildren = false;

    if (menuItem.children) {
      for (const childItem of menuItem.children) {
        this.hideChildren(childItem);
      }
    }
  }
}
