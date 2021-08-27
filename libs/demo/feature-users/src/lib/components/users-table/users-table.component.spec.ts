import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createPersistentUser } from '../../models/user.dto.fixture';
import { UsersTableComponent } from './users-table.component';

describe('UsersListComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UsersTableComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('cell selection', () => {
    it('emits userSelected event when selecting a cell from the name column', () => {
      jest.spyOn(component.cellSelected, 'emit');
      const user = createPersistentUser();

      component.onCellSelected(user);

      expect(component.cellSelected.emit).toHaveBeenCalledWith(user.id);
    });
  });
});
