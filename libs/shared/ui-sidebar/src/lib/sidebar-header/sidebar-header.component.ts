import { Component, Input } from '@angular/core';

@Component({
  selector: 'demo-sidebar-header',
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.scss']
})
export class SidebarHeaderComponent {
  @Input() expanded: boolean;
  @Input() applicationLogo: string;
  @Input() applicationName: string;
  @Input() applicationShortName: string;
}
