import { Component } from '@angular/core';
import { MenuHeader, MenuItem } from '@demo/shared/ui-sidebar';
import { BODY_ITEMS } from '../../models/sidebar-body.model';
import { FOOTER_ITEMS } from '../../models/sidebar-footer.model';
import { HEADER_DATA } from '../../models/sidebar-header.model';

@Component({
  selector: 'demo-sidebar-container',
  templateUrl: './sidebar-container.component.html',
  styleUrls: ['./sidebar-container.component.scss']
})
export class SidebarContainerComponent {
  bodyItems: MenuItem[] = BODY_ITEMS;
  footerItems: MenuItem[] = FOOTER_ITEMS;
  header: MenuHeader = HEADER_DATA;
}
