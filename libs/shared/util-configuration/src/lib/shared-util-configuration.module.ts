import { CommonModule } from '@angular/common';
import { Inject, InjectionToken, NgModule } from '@angular/core';
import { AppConfiguration } from './configuration.model';
import { ConfigurationService } from './configuration.service';

export const APP_CONFIGURATION = new InjectionToken<AppConfiguration>('APP_CONFIGURATION');

@NgModule({
  imports: [CommonModule]
})
export class SharedUtilConfigurationModule {
  constructor(@Inject(APP_CONFIGURATION) configuration: AppConfiguration, configurationService: ConfigurationService) {
    configurationService.setConfiguration(configuration);
  }
}
