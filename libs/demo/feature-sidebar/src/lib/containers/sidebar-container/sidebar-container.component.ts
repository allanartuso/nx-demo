import { Component } from '@angular/core';
import { ClickActionType, MenuHeader, MenuItem } from '@demo/shared/ui-sidebar';
import { Observable } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'demo-sidebar-container',
  templateUrl: './sidebar-container.component.html',
  styleUrls: ['./sidebar-container.component.scss']
})
export class SidebarContainerComponent {
  expanded$: Observable<boolean> = this.sidebarService.expanded$;
  bodyItems: MenuItem[] = this.sidebarService.bodyItems;
  footerItems: MenuItem[] = this.sidebarService.footerItems;
  header: MenuHeader = this.sidebarService.header;

  constructor(private readonly sidebarService: SidebarService) {}

  onMenuItemClicked(item: MenuItem): void {
    switch (item.clickAction) {
      case ClickActionType.LOGOUT:
        break;
      case ClickActionType.SIDE_BAR_TOGGLE:
        this.sidebarService.onSidebarToggle(item);
        break;
    }
  }

  onMenuItemHoveredOn(menuItem: MenuItem): void {
    this.sidebarService.onMenuItemHoveredOn(menuItem);
  }

  onMenuItemHoveredOff(menuItem: MenuItem): void {
    this.sidebarService.onMenuItemHoveredOff(menuItem);
  }

  onMenuItemToggled(menuItem: MenuItem): void {
    this.sidebarService.onMenuItemToggled(menuItem);
  }

  onClosingSidebar(): void {
    this.sidebarService.onClosingSidebar();
  }
}
