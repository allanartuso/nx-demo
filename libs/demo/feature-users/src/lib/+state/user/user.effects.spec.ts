import { TestBed } from '@angular/core/testing';
import { changePasswordAction, logoutAction } from '@demo/acm/feature-authentication';
import { UserDto, UserService, USERS_I18N_SCOPE } from '@demo/shared/acm/data-access/users';
import { userDtoFixture } from '@demo/shared/acm/data-access/users/test';
import { displayConfirmationDialogAction, selectConfirmationDialogResponse } from '@demo/shared/util-notification';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { formActions } from './user.actions';
import { UserEffects } from './user.effects';
import { formSelectors } from './user.selectors';

describe('UserEffects', () => {
  let actions$: Observable<Action>;
  let effects: UserEffects;
  let store: MockStore;

  const tenantId = 12;
  const user: UserDto = userDtoFixture.createPersistentUser(tenantId);

  beforeEach(() => {
    const mockService: Partial<UserService> = {
      loadResource: jest.fn().mockReturnValue(of(user))
    };

    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: UserService,
          useValue: mockService
        }
      ]
    });

    effects = TestBed.inject(UserEffects);
    store = TestBed.inject(MockStore);

    spyOn(store, 'dispatch');
    store.overrideSelector(selectConfirmationDialogResponse, true);
    store.overrideSelector(formSelectors.getResource, user);
  });

  describe('showRemovalConfirmation$', () => {
    it('shows removal confirmation dialog and dispatches the delete action when confirming the removal', () => {
      const expected = hot('a', {
        a: formActions.delete({ resourceId: user.resourceId })
      });
      actions$ = hot('a', { a: formActions.showRemovalConfirmation() });

      expect(effects.showRemovalConfirmation$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(
        displayConfirmationDialogAction({
          settings: {
            confirmationInput: true,
            label: 'username',
            expectedInput: user.email,
            i18nScope: USERS_I18N_SCOPE,
            title: 'deleteUserConfirmationTitle',
            message: 'deleteUserConfirmationText'
          }
        })
      );
    });
  });

  describe('showChangePasswordConfirmation$', () => {
    it('show change user password confirmation dialog', () => {
      const expected = hot('a', { a: changePasswordAction() });
      actions$ = hot('a', { a: formActions.showChangePasswordConfirmation() });

      expect(effects.showChangePasswordConfirmation$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(
        displayConfirmationDialogAction({
          settings: {
            i18nScope: USERS_I18N_SCOPE,
            title: 'changePasswordConfirmationTitle',
            message: 'changePasswordConfirmationText'
          }
        })
      );
    });
  });

  describe('logout$', () => {
    it('show change user password confirmation dialog', () => {
      store.overrideSelector(formSelectors.getResource, null);
      const expected = hot('a', { a: logoutAction() });
      actions$ = hot('a', { a: formActions.deleteSuccess({ resourceId: user.resourceId }) });

      expect(effects.logout$).toBeObservable(expected);
    });
  });
});
