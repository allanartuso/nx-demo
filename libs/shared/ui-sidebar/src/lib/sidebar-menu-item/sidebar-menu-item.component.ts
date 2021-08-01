import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from '../models/sidebar.models';

@Component({
  selector: 'demo-sidebar-menu-item',
  templateUrl: './sidebar-menu-item.component.html',
  styleUrls: ['./sidebar-menu-item.component.scss']
})
export class SidebarMenuItemComponent {
  @Input() menuItem: MenuItem;
  @Input() expanded: boolean;

  @Output() menuItemHoveredOn: EventEmitter<MenuItem> = new EventEmitter();
  @Output() menuItemHoveredOff: EventEmitter<MenuItem> = new EventEmitter();
  @Output() menuItemClicked: EventEmitter<MenuItem> = new EventEmitter();
  @Output() menuItemToggled: EventEmitter<MenuItem> = new EventEmitter();

  onMenuItemHoveredOn(item: MenuItem): void {
    this.menuItemHoveredOn.emit(item);
  }

  onMenuItemHoveredOff(item: MenuItem): void {
    this.menuItemHoveredOff.emit(item);
  }

  onMenuItemClicked(item: MenuItem): void {
    this.menuItemClicked.emit(item);
  }

  onMenuItemToggled(item: MenuItem): void {
    this.menuItemToggled.emit(item);
  }
}
