import { NgModule } from '@angular/core';
import { SharedUtilNotificationModule } from '@demo/shared/util-notification';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserEffects } from './+state/user/user.effects';
import { userReducer, USER_FEATURE_KEY } from './+state/user/user.reducer';
import { UsersEffects } from './+state/users/users.effects';
import { usersReducer, USERS_FEATURE_KEY } from './+state/users/users.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(USER_FEATURE_KEY, userReducer),
    StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
    EffectsModule.forFeature([UserEffects, UsersEffects]),
    SharedUtilNotificationModule
  ]
})
export class DemoDataAccessUsersModule {}
