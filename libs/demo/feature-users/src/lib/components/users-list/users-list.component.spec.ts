import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { userDtoFixture } from '@demo/shared/acm/data-access/users/test';
import { MockIgxGridComponent } from '@demo/shared/acm/ui/common/vendors/igniteui/test';
import { IGridCellEventArgs } from 'igniteui-angular';
import { UsersListComponent } from './users-list.component';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  const users = userDtoFixture.createPersistentUsers();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UsersListComponent, MockIgxGridComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    component.gridData = users;
    component.translate = jest.fn();
    fixture.detectChanges();
  });

  describe('cell selection', () => {
    it('emits userSelected event when selecting a cell from the name column', () => {
      spyOn(component.nameCellSelected, 'emit');
      const user = userDtoFixture.createPersistentUser();
      const field = 'name';
      const mockGridCell = { cell: { rowData: user, column: { field } } } as IGridCellEventArgs;

      component.onCellSelected(mockGridCell);

      expect(component.nameCellSelected.emit).toHaveBeenCalledWith(user.resourceId);
    });
  });
});
