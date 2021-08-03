import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
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
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserComponent } from './containers/user/user.component';
import { UsersComponent } from './containers/users/users.component';
import { UserResolver } from './services/user.resolver';
import { UsersResolver } from './services/users.resolver';

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
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    SharedUiNotificationModule
  ],
  declarations: [UserComponent, UserFormComponent, UsersComponent, UsersListComponent]
})
export class DemoFeatureUsersModule {}
