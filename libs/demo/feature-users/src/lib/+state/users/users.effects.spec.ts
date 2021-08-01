import { TestBed } from '@angular/core/testing';
import { ErrorsDto, ErrorsVm, GeneralErrorCode } from '@demo/shared/acm/data-access/common';
import { errorsModelFixture } from '@demo/shared/acm/data-access/common/test';
import { getCurrentOrganizationTenantId } from '@demo/shared/acm/data-access/organizations';
import { UserDto, UsersService, USERS_I18N_SCOPE } from '@demo/shared/acm/data-access/users';
import { userDtoFixture } from '@demo/shared/acm/data-access/users/test';
import {
  displayUserNotificationAction,
  NotificationType,
  selectConfirmationDialogResponse
} from '@demo/shared/util-notification';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, createAction, props } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { UserNotificationsService } from '../../services/user-notifications.service';
import { listActions } from './users.actions';
import { UsersEffects } from './users.effects';
import { listSelectors } from './users.selectors';

describe('UsersEffects', () => {
  let actions$: Observable<Action>;
  let effects: UsersEffects;
  let store: MockStore;
  let selectedResourceIds: string[];
  let userNotificationsService: UserNotificationsService;

  const tenantId = 12;
  const users: UserDto[] = userDtoFixture.createPersistentUsers(tenantId);

  beforeEach(() => {
    selectedResourceIds = [users[0].resourceId, users[1].resourceId];

    const mockService: Partial<UsersService> = {
      queryResources: jest.fn().mockReturnValue(of(users))
    };

    const mockNotificationsService: Partial<UserNotificationsService> = {
      displayRemovalConfirmationDialog$: jest.fn().mockReturnValue(of(selectedResourceIds))
    };

    TestBed.configureTestingModule({
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: UsersService,
          useValue: mockService
        },
        {
          provide: UserNotificationsService,
          useValue: mockNotificationsService
        }
      ]
    });

    effects = TestBed.inject(UsersEffects);
    store = TestBed.inject(MockStore);
    store.overrideSelector(getCurrentOrganizationTenantId, tenantId);
    userNotificationsService = TestBed.inject(UserNotificationsService);
  });

  describe('showRemovalsDialog$', () => {
    const selectedUsers = users.slice(0, 2);

    beforeEach(() => {
      spyOn(store, 'dispatch');
      store.overrideSelector(listSelectors.getSelectedResourceIds, selectedResourceIds);
      store.overrideSelector(selectConfirmationDialogResponse, true);
      store.overrideSelector(
        listSelectors.getSelected,
        selectedUsers.reduce((summaries, user) => {
          return { ...summaries, [user.resourceId]: user };
        }, {})
      );
    });

    it('shows users removal confirmation dialog and dispatches the delete users action when confirming the users removal', () => {
      const expected = hot('a', { a: listActions.delete({ resourceIds: selectedResourceIds }) });
      actions$ = hot('a', { a: listActions.showRemovalsConfirmation() });

      expect(effects.showRemovalsDialog$).toBeObservable(expected);
      expect(userNotificationsService.displayRemovalConfirmationDialog$).toHaveBeenCalledWith(users.slice(0, 2));
    });
  });

  describe('deleteUsersSuccess$', () => {
    it('emits an info notification when receiving delete Users success action', () => {
      selectedResourceIds = [users[0].resourceId, users[1].resourceId];
      const expected = hot('a', {
        a: displayUserNotificationAction({
          messages: [
            {
              type: NotificationType.INFO,
              code: 'resourcesRemovedSuccessfully',
              i18nScope: USERS_I18N_SCOPE
            }
          ]
        })
      });
      actions$ = hot('a', {
        a: listActions.deleteSuccess({ resourceIds: selectedResourceIds })
      });

      expect(effects.deleteUsersSuccess$).toBeObservable(expected);
    });

    it('emits an info notification when deleting one User successfully', () => {
      selectedResourceIds = [users[0].resourceId];
      const expected = hot('a', {
        a: displayUserNotificationAction({
          messages: [
            {
              type: NotificationType.INFO,
              code: 'resourceRemovedSuccessfully',
              i18nScope: USERS_I18N_SCOPE
            }
          ]
        })
      });
      actions$ = hot('a', {
        a: listActions.deleteSuccess({ resourceIds: selectedResourceIds })
      });

      expect(effects.deleteUsersSuccess$).toBeObservable(expected);
    });
  });

  describe('addGeneralErrorsArguments$', () => {
    const failureAction = createAction('Failure Action', props<{ error: ErrorsVm }>());
    let errorsVm: ErrorsVm;

    beforeEach(() => {
      const errorsDto: ErrorsDto = {
        generalErrors: [
          {
            code: GeneralErrorCode.RESOURCE_NOT_FOUND,
            message: 'testError',
            arguments: []
          }
        ],
        fieldErrors: []
      };

      errorsVm = new ErrorsVm(
        errorsModelFixture.createGeneralErrorsVm(
          errorsDto.generalErrors,
          users.map(resource => resource.resourceId)
        )
      );

      spyOn(store, 'dispatch');
      store.overrideSelector(
        listSelectors.getSelected,
        users.reduce((summaries, user) => ({ ...summaries, [user.resourceId]: user }), {})
      );
    });

    it('dispatches the failure and load action when there are successful responses.', () => {
      errorsVm.successes.push({ index: 0, response: {} });
      const expected = cold('(ab|)', {
        a: failureAction({ error: errorsVm }),
        b: listActions.refresh()
      });

      expect(effects.addGeneralErrorsArguments$(errorsVm, failureAction)).toBeObservable(expected);
    });

    it('dispatches the failure action when there are no successful responses.', () => {
      const expected = cold('(a|)', {
        a: failureAction({ error: errorsVm })
      });

      expect(effects.addGeneralErrorsArguments$(errorsVm, failureAction)).toBeObservable(expected);
    });
  });
});
