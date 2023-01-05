import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { userActions, userSelectors } from '@demo/demo/data-access/users';
import { UserDto } from '@demo/demo/data-model/users';
import { createPersistentUser, createTransientUser } from '@demo/demo/data-model/users/test';
import { RequestState } from '@ngdux/data-model-common';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let store: MockStore;
  let user: UserDto;

  beforeEach(waitForAsync(() => {
    user = createPersistentUser();

    TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: userSelectors.getResource, value: user },
            { selector: userSelectors.getRequestState, value: RequestState.IDLE }
          ]
        })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

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
    expect(store.dispatch).toHaveBeenCalledWith(userActions.save({ resource: user }));
  });

  it('saves the user', () => {
    const newUser = createTransientUser();

    component.onUserSaved(newUser);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(userActions.create({ resource: newUser }));
  });
});
