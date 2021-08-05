import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { userDtoFixture } from '@demo/shared/acm/data-access/users/test';
import { MockIgxGridComponent } from '@demo/shared/acm/ui/common/vendors/igniteui/test';
import { IGridCellEventArgs } from 'igniteui-angular';
import { UsersTableComponent } from './users-table.component';

describe('UsersListComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;
  const users = userDtoFixture.createPersistentUsers();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UsersTableComponent, MockIgxGridComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
    component.gridData = users;
    component.translate = jest.fn();
    fixture.detectChanges();
  });

  describe('cell selection', () => {
    it('emits userSelected event when selecting a cell from the name column', () => {
      spyOn(component.cellSelected, 'emit');
      const user = userDtoFixture.createPersistentUser();
      const field = 'name';
      const mockGridCell = { cell: { rowData: user, column: { field } } } as IGridCellEventArgs;

      component.onCellSelected(mockGridCell);

      expect(component.cellSelected.emit).toHaveBeenCalledWith(user.resourceId);
    });
  });
});
