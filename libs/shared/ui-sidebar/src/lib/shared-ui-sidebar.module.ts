import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import { SidebarMenuItemComponent } from './sidebar-menu-item/sidebar-menu-item.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [CommonModule, MatIconModule, RouterModule],
  declarations: [SidebarComponent, SidebarHeaderComponent, SidebarMenuItemComponent]
})
export class SharedUiSidebarModule {}
