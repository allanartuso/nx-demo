import { Injectable } from '@angular/core';
import { AppConfiguration } from './configuration.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private configuration!: AppConfiguration;

  setConfiguration(configurations: AppConfiguration): void {
    this.configuration = configurations;
  }

  getConfiguration(): AppConfiguration {
    return this.configuration;
  }
}
