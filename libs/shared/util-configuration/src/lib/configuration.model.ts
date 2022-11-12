import { InjectionToken } from '@angular/core';

export const APP_CONFIGURATION = new InjectionToken<AppConfiguration>('APP_CONFIGURATION');

export interface EnvironmentConfiguration {
  local: AppConfiguration;
  production: AppConfiguration;
}

export interface AppConfiguration {
  apiBaseUrl: string;
}
