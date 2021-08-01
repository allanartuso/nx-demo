import { Component, Input } from '@angular/core';
import { MenuHeader } from '../../models/sidebar.models';

@Component({
  selector: 'demo-sidebar-header',
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.scss']
})
export class SidebarHeaderComponent {
  @Input() expanded: boolean;
  @Input() header: MenuHeader;
}
