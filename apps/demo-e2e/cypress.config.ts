import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  modifyObstructiveCode: false,
  video: true,
  videosFolder: '../../dist/cypress/apps/demo-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/demo-e2e/screenshots',
  chromeWebSecurity: false,
  viewportWidth: 1280,
  viewportHeight: 720,
  watchForFileChanges: false,
  numTestsKeptInMemory: 10,
  e2e: {
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://localhost:4200',
    specPattern: './src/integration/**/*.cy.{js,jsx,ts,tsx}'
  }
});
