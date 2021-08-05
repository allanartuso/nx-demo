import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { SharedUiListModule } from '@demo/shared/ui-list';
import { SharedUiNotificationModule } from '@demo/shared/ui-notification';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserEffects } from './+state/user/user.effects';
import { userReducer, USER_FEATURE_KEY } from './+state/user/user.reducer';
import { UsersEffects } from './+state/users/users.effects';
import { usersReducer, USERS_FEATURE_KEY } from './+state/users/users.reducer';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { UserComponent } from './containers/user/user.component';
import { UsersComponent } from './containers/users/users.component';
import { UserResolver } from './resolvers/user.resolver';
import { UsersResolver } from './resolvers/users.resolver';

export const usersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        resolve: [UsersResolver],
        component: UsersComponent
      },
      {
        path: `new`,
        resolve: [UserResolver],
        component: UserComponent
      },
      {
        path: `:id`,
        resolve: [UserResolver],
        component: UserComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(USER_FEATURE_KEY, userReducer),
    StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
    EffectsModule.forFeature([UserEffects, UsersEffects]),
    ReactiveFormsModule,
    RouterModule.forChild(usersRoutes),
    SharedUiFormModule,
    SharedUiListModule,
    MatDialogModule,
    SharedUiNotificationModule
  ],
  declarations: [UserComponent, UserFormComponent, UsersComponent, UsersTableComponent]
})
export class DemoFeatureUsersModule {}
