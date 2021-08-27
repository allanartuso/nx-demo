import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RequestState } from '@demo/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { formActions } from '../../+state/user/user.actions';
import { formSelectors } from '../../+state/user/user.selectors';
import { UserDto } from '../../models/user.dto';
import { createPersistentUser, createTransientUser } from '../../models/user.dto.fixture';
import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let store: MockStore;
  let user: UserDto;

  beforeEach(
    waitForAsync(() => {
      user = createPersistentUser();

      TestBed.configureTestingModule({
        declarations: [UserComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: formSelectors.getResource, value: user },
              { selector: formSelectors.getRequestState, value: RequestState.IDLE }
            ]
          })
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates a user', () => {
    component.onUserSaved(user);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(formActions.save({ resource: user }));
  });

  it('saves the user', () => {
    const newUser = createTransientUser();

    component.onUserSaved(newUser);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(formActions.create({ resource: newUser }));
  });
});
