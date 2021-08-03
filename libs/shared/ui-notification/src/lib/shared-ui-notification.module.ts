import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }],
  declarations: [ConfirmationDialogComponent]
})
export class SharedUiNotificationModule {}
