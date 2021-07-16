import { AppConfiguration, EnvironmentConfiguration } from '@noumena/shared/util-configuration';
import { environment } from '../environments/environment';

const ENVIRONMENT_CONFIGURATION: EnvironmentConfiguration = {
  local: {
    apiBaseUrl: 'http://localhost:8080'
  },
  production: {
    apiBaseUrl: ''
  }
};

export function getAppConfiguration(): AppConfiguration {
  if (environment.production) {
    return ENVIRONMENT_CONFIGURATION.production;
  }

  return ENVIRONMENT_CONFIGURATION.local;
}
