import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { APP_CONFIGURATION } from '@demo/shared/util-configuration';
import { SharedUtilStoreModule } from '@demo/shared/util-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { getAppConfiguration } from './environment-configuration.model';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users'
  },
  {
    path: 'users',
    loadChildren: () => import('@demo/demo/feature-users').then(module => module.DemoFeatureUsersModule)
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, {
      scrollPositionRestoration: 'enabled'
    }),
    SharedUtilStoreModule,
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    {
      provide: APP_CONFIGURATION,
      useFactory: getAppConfiguration
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
