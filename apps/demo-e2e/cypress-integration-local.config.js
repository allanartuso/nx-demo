const { defineConfig } = require('cypress');

module.exports = defineConfig({
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
    specPattern: './src/integration-local/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts',
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});
