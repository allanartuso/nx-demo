import { Component, EventEmitter, Output } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { AbstractTableComponent, TableColumn } from '@demo/shared/ui-list';

@Component({
  selector: 'demo-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent extends AbstractTableComponent<UserDto> {
  @Output() cellSelected = new EventEmitter<string>();

  columns: TableColumn[] = [
    { key: 'email', name: 'Email' },
    { key: 'firstName', name: 'First Name' },
    { key: 'lastName', name: 'Last Name' }
  ];

  onCellSelected(user: UserDto): void {
    this.cellSelected.emit(user.id);
  }
}
