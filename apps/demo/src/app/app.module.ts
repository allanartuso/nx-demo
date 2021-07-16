import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_CONFIGURATION } from '@noumena/shared/util-configuration';
import { AppComponent } from './app.component';
import { getAppConfiguration } from './environment-configuration.model';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [
    {
      provide: APP_CONFIGURATION,
      useFactory: getAppConfiguration
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
