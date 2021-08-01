import { Injectable } from '@angular/core';
import { MenuHeader, MenuItem } from '@demo/shared/ui-sidebar';
import { BehaviorSubject } from 'rxjs';
import { BODY_ITEMS } from '../models/sidebar-body.model';
import { FOOTER_ITEMS } from '../models/sidebar-footer.model';
import { HEADER_DATA } from '../models/sidebar-header.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  expanded = false;
  bodyItems: MenuItem[] = BODY_ITEMS;
  footerItems: MenuItem[] = FOOTER_ITEMS;
  header: MenuHeader = HEADER_DATA;

  private readonly expandedSubject: BehaviorSubject<boolean> = new BehaviorSubject(this.expanded);
  expanded$ = this.expandedSubject.asObservable();

  onMenuItemHoveredOn(item: MenuItem): void {
    if (!this.expanded) {
      item.displayChildren = true;
    }

    if (!item.group) {
      item.hover = true;
    }
  }

  onMenuItemHoveredOff(item: MenuItem): void {
    if (!this.expanded) {
      item.displayChildren = false;
    }
    if (!item.group) {
      item.hover = false;
    }
  }

  onSidebarToggle(item = this.selectMenuItemByName('collapse')): void {
    this.expanded = !this.expanded;
    this.expandedSubject.next(this.expanded);

    if (this.expanded) {
      item.icon = 'chevron_left';
    } else {
      item.icon = 'chevron_right';
    }
  }

  onMenuItemToggled(item: MenuItem): void {
    item.displayChildren = !item.displayChildren;
  }

  onClosingSidebar(): void {
    for (const menuItem of [...this.bodyItems, ...this.footerItems]) {
      this.hideChildren(menuItem);
    }
  }

  private hideChildren(menuItem: MenuItem): void {
    menuItem.displayChildren = false;

    if (menuItem.children) {
      for (const childItem of menuItem.children) {
        this.hideChildren(childItem);
      }
    }
  }

  private selectMenuItemByName(menuItemName: string): MenuItem {
    return [...this.bodyItems, ...this.footerItems].find(item => item.name === menuItemName);
  }
}
