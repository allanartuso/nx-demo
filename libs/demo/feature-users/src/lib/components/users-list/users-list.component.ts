import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractListComponent } from '@demo/shared/ui-list';
import { UserDto } from '../../models/user.dto';

@Component({
  selector: 'demo-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent extends AbstractListComponent<UserDto> {
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
