import { AppConfiguration } from './configuration.model';
import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;

  beforeEach(() => {
    service = new ConfigurationService();
  });

  it('return an undefined configuration when no configuration is provided', () => {
    expect(service.getConfiguration()).toBe(undefined);
  });

  it('sets the given configuration', () => {
    const expectedConfiguration: AppConfiguration = {
      apiBaseUrl: 'baseUrl'
    };

    service.setConfiguration(expectedConfiguration);

    expect(service.getConfiguration()).toStrictEqual(expectedConfiguration);
  });
});
