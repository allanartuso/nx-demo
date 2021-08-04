import { AppConfiguration, EnvironmentConfiguration } from '@demo/shared/util-configuration';
import { environment } from '../environments/environment';

const ENVIRONMENT_CONFIGURATION: EnvironmentConfiguration = {
  local: {
    apiBaseUrl: 'http://localhost:8080/api'
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
