import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { SharedUiListModule } from '@demo/shared/ui-list';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersTableComponent } from './components/users-table/users-table.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedUiFormModule, SharedUiListModule, MatDialogModule],
  declarations: [UserFormComponent, UsersTableComponent],
  exports: [UserFormComponent, UsersTableComponent]
})
export class DemoUiUsersModule {}
