import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { APP_CONFIGURATION } from '@demo/shared/util-configuration';
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
    })
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
