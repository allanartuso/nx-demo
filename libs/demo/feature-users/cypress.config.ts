import { nxComponentTestingPreset } from '@nrwl/angular/plugins/component-testing';
import { defineConfig } from 'cypress';

export default defineConfig({
  component: nxComponentTestingPreset(__filename),
  viewportWidth: 1280,
  viewportHeight: 720
});
