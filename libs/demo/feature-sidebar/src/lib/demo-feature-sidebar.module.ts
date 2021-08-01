import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedUiSidebarModule } from '@demo/shared/ui-sidebar';
import { SidebarContainerComponent } from './containers/sidebar-container/sidebar-container.component';

// TODO: it is probably possible to move the service to the ui level and remove completely this module, using the models directly in the app level
@NgModule({
  imports: [CommonModule, SharedUiSidebarModule],
  declarations: [SidebarContainerComponent],
  exports: [SidebarContainerComponent]
})
export class DemoFeatureSidebarModule {}
