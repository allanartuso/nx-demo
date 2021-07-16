import { createFormSelectors, FormState } from '@arviem/acm/feature/common/form';
import { UserDto } from '@arviem/shared/acm/data-access/users';
import { RequestState } from '@arviem/shared/data-access';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { avatarSelectors } from '../avatar/avatar.selectors';
import { USER_FEATURE_KEY } from './user.reducer';

const getState = createFeatureSelector<FormState<UserDto>>(USER_FEATURE_KEY);

const selectors = createFormSelectors(getState);

export const isReady = createSelector(
  selectors.getResource,
  avatarSelectors.getResource,
  selectors.getLoadingState,
  (user, avatar, loadingState) => {
    return !!user && (!!avatar || !user.avatarReference) && loadingState === RequestState.SUCCESS;
  }
);

export const formSelectors = { ...selectors, isReady };
