import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { DemoFeatureSidebarModule } from '@demo/demo/feature-sidebar';
import { APP_CONFIGURATION, SharedUtilConfigurationModule } from '@demo/shared/util-configuration';
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
    loadChildren: () => import('@demo/demo/feature/users').then(module => module.DemoFeatureUsersModule)
  },
  {
    path: '**',
    redirectTo: 'users'
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(ROUTES, {
      scrollPositionRestoration: 'enabled'
    }),
    SharedUtilStoreModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    SharedUtilConfigurationModule,
    BrowserAnimationsModule,
    DemoFeatureSidebarModule
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
