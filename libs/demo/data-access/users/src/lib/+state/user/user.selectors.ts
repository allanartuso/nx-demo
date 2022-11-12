import { UserDto } from '@demo/demo/data-model/users';
import { createFormSelectors, FormState } from '@demo/shared/util-store';
import { createFeatureSelector } from '@ngrx/store';
import { USER_FEATURE_KEY } from './user.reducer';

const getState = createFeatureSelector<FormState<UserDto>>(USER_FEATURE_KEY);

export const formSelectors = createFormSelectors(getState);
