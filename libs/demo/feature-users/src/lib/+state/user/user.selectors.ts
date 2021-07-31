import { createFormSelectors, FormState } from '@demo/shared/util-store';
import { createFeatureSelector } from '@ngrx/store';
import { UserDto } from '../../models/user.dto';
import { USER_FEATURE_KEY } from './user.reducer';

const getState = createFeatureSelector<FormState<UserDto>>(USER_FEATURE_KEY);

export const formSelectors = createFormSelectors(getState);
