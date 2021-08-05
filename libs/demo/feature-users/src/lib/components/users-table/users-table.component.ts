import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractTableComponent } from '@demo/shared/ui-list';
import { UserDto } from '../../models/user.dto';

@Component({
  selector: 'demo-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent extends AbstractTableComponent<UserDto> {
  @Output() nameCellSelected = new EventEmitter<string>();

  columns = [
    { key: 'email', name: 'Email' },
    { key: 'firstName', name: 'First Name' },
    { key: 'lastName', name: 'Last Name' }
  ];

  onCellSelected(user: UserDto): void {
    this.nameCellSelected.emit(user.id);
  }
}
