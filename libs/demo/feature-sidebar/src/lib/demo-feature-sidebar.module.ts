import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedUiSidebarModule } from '@demo/shared/ui-sidebar';
import { SidebarContainerComponent } from './containers/sidebar-container/sidebar-container.component';

@NgModule({
  imports: [CommonModule, SharedUiSidebarModule],
  declarations: [SidebarContainerComponent],
  exports: [SidebarContainerComponent]
})
export class DemoFeatureSidebarModule {}
