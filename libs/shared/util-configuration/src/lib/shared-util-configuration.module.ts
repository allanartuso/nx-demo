import { CommonModule } from '@angular/common';
import { Inject, NgModule } from '@angular/core';
import { AppConfiguration, APP_CONFIGURATION } from './configuration.model';
import { ConfigurationService } from './configuration.service';

@NgModule({
  imports: [CommonModule]
})
export class SharedUtilConfigurationModule {
  constructor(@Inject(APP_CONFIGURATION) configuration: AppConfiguration, configurationService: ConfigurationService) {
    configurationService.setConfiguration(configuration);
  }
}
