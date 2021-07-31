import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserEffects } from './+state/user/user.effects';
import { userReducer, USER_FEATURE_KEY } from './+state/user/user.reducer';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserComponent } from './containers/user/user.component';
import { UserResolver } from './services/user.resolver';

export const usersRoutes: Routes = [
  {
    path: '',
    children: [
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
    EffectsModule.forFeature([UserEffects]),
    ReactiveFormsModule,
    RouterModule.forChild(usersRoutes),
    SharedUiFormModule
  ],
  declarations: [UserComponent, UserFormComponent]
})
export class DemoFeatureUsersModule {}
