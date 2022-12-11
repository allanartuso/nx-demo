import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@demo/shared/data-model';
import { createFormSelectors, FormState } from '@ngdux/form';
import { createFeatureSelector } from '@ngrx/store';
import { USER_FEATURE_KEY } from './user.reducer';

const getState = createFeatureSelector<FormState<UserDto, ErrorDto>>(USER_FEATURE_KEY);

export const formSelectors = createFormSelectors(getState);
