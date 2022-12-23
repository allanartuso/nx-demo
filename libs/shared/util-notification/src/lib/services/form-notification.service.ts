import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto, FormNotificationService as NgduxFormNotificationService } from '@demo/shared/data-model/common';

@Injectable({
  providedIn: 'root'
})
export class FormNotificationService implements NgduxFormNotificationService<ErrorDto> {
  constructor(private readonly snackBar: MatSnackBar) {}

  onErrors(errors: ErrorDto): void {
    this.snackBar.open(errors.message);
  }

  onDelete(id: string): void {
    this.snackBar.open(`Resource ${id} has been deleted.`);
  }
}
