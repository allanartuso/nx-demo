import { Action } from '@ngrx/store';
import { RequestState } from '@demo/shared/ui-form';
import { UserDto } from '../../models/user.dto';

export const USER_FEATURE_KEY = 'user';

export interface UserState {
  user: UserDto;
  requestState: RequestState;
}

const initialState: UserState = {
  user: undefined,
  requestState: RequestState.IDLE
};

const reducer = createReducer<UserState>(
  initialState,
  on(btCandlesActions.load, (): UserState => initialState),
  on(btCandlesActions.loadSuccess, (state, { resources }): UserState => ({ ...state, resources }))
);

export function userReducer(state: UserState, action: Action): UserState {
  return reducer(state, action);
}
