import { UserDto } from '@demo/demo/data-model/users';
import { createListSelectors, ListState } from '@demo/shared/util-store';
import { createFeatureSelector } from '@ngrx/store';
import { entityAdapter, USERS_FEATURE_KEY } from './users.reducer';

const getState = createFeatureSelector<ListState<UserDto>>(USERS_FEATURE_KEY);

export const listSelectors = createListSelectors(entityAdapter, getState);
