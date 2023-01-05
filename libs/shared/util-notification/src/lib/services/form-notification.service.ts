import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto, FormNotificationService, ListNotificationService } from '@ngdux/data-model-common';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements FormNotificationService<ErrorDto>, ListNotificationService {
  constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog) {}

  onErrors(errors: ErrorDto): void {
    this.snackBar.open(errors.message);
  }

  onDelete(id: string): void {
    this.snackBar.open(`Resource ${id} has been deleted.`);
  }

  openConfirmationDialog(data: { message: string; title: string }): Observable<boolean> {
    const dialog = this.dialog.open(ConfirmationDialogComponent, { data });

    return dialog.afterClosed();
  }
}
