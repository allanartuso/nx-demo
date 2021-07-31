import { createFormSelectors, FormState } from '@demo/acm/feature/common/form';
import { UserDto } from '@demo/shared/acm/data-access/users';
import { createFeatureSelector } from '@ngrx/store';
import { USER_FEATURE_KEY } from './user.reducer';

const getState = createFeatureSelector<FormState<UserDto>>(USER_FEATURE_KEY);

export const formSelectors = createFormSelectors(getState);
