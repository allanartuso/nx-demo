import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilteringLogic } from '@demo/shared/data-access';
import { SharedUiListModule } from '@demo/shared/ui-list';
import { SharedUiNotificationModule } from '@demo/shared/ui-notification';
import { mount, MountConfig } from 'cypress/angular';
import { UserComponent } from '../../containers/user/user.component';
import { UsersComponent } from '../../containers/users/users.component';
import { createPersistentUsers } from '../../models/user.dto.fixture';
import { UserFormComponent } from '../user-form/user-form.component';
import { UsersTableComponent } from './users-table.component';

describe(UsersTableComponent.name, () => {
  const users = createPersistentUsers(35);

  const config: MountConfig<UsersTableComponent> = {
    imports: [BrowserAnimationsModule, CommonModule, SharedUiListModule, MatDialogModule, SharedUiNotificationModule],
    declarations: [UserComponent, UserFormComponent, UsersComponent, UsersTableComponent],
    componentProperties: {
      gridData: users,
      pagingOptions: { page: 1, pageSize: 5 },
      sortingOptions: {},
      filteringOptions: { logic: FilteringLogic.AND, filters: [] }
    }
  };

  it('renders', () => {
    mount(UsersTableComponent, config);
  });
});
