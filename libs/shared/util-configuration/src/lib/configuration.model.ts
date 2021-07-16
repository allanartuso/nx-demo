export interface EnvironmentConfiguration {
  local: AppConfiguration;
  production: AppConfiguration;
}

export interface AppConfiguration {
  apiBaseUrl: string;
}
