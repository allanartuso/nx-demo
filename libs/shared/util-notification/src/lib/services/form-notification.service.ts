import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto } from '@demo/shared/data-model';
import { NgDuxFormNotificationService } from '@ngdux/form';

@Injectable({
  providedIn: 'root'
})
export class FormNotificationService implements NgDuxFormNotificationService<ErrorDto> {
  constructor(private readonly snackBar: MatSnackBar) {}

  onErrors = (errors: ErrorDto) => {
    this.snackBar.open(errors.message);
  };

  onDelete = (id: string) => {
    this.snackBar.open(`Resource ${id} has been deleted.`);
  };
}
