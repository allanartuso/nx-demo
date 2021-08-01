import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SidebarHeaderComponent } from './components/sidebar-header/sidebar-header.component';
import { SidebarMenuItemComponent } from './components/sidebar-menu-item/sidebar-menu-item.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  imports: [CommonModule, MatIconModule, RouterModule],
  declarations: [SidebarComponent, SidebarHeaderComponent, SidebarMenuItemComponent],
  exports: [SidebarComponent]
})
export class SharedUiSidebarModule {}
