import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from '../models/sidebar.models';

@Component({
  selector: 'demo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() expanded: boolean;

  @Input() expandedWidth = '280px';
  @Input() compactedWidth = '75px';

  @Input() applicationLogo: string;
  @Input() applicationName: string;
  @Input() applicationShortName: string;
  @Input() bodyItems: MenuItem[] = [];
  @Input() footerItems: MenuItem[] = [];

  @Output() logout = new EventEmitter<void>();
  @Output() menuItemClicked = new EventEmitter<MenuItem>();
  @Output() menuItemHoveredOn = new EventEmitter<MenuItem>();
  @Output() menuItemHoveredOff = new EventEmitter<MenuItem>();
  @Output() menuItemToggled = new EventEmitter<MenuItem>();
  @Output() closingSidebar = new EventEmitter<void>();

  // onClosing(): void {
  //   this.closingSidebar.emit();
  // }

  onMenuItemHoveredOff(item: MenuItem): void {
    this.menuItemHoveredOff.emit(item);
  }

  onMenuItemHoveredOn(item: MenuItem): void {
    this.menuItemHoveredOn.emit(item);
  }

  onMenuItemClicked(item: MenuItem): void {
    this.menuItemClicked.emit(item);
  }

  onMenuItemToggled(item: MenuItem): void {
    this.menuItemToggled.emit(item);
  }
}
