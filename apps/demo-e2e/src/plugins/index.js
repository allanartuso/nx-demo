// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { preprocessTypescript } = require('@nrwl/cypress/plugins/preprocessor');
// const { preprocessTypescript } = require('./typescript-preprocessor');

// const fs = require('fs');
// const glob = require('glob');
const path = require('path');
const root = path.join(__dirname, '..');

// glob(`${root}/integration/**/*.spec.ts`, (err, files) => {
//   let code = '';
//   files.forEach(file => {
//     code += `require('${file.replace(root, '..')}');\n`;
//   });
//   fs.writeFileSync(`${root}/integration-local/main.spec.ts`, code);
// });

module.exports = (on, config) => {
  config.env.tsConfig = path.join(root, '..', 'tsconfig.json');
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Preprocess Typescript file using Nx helper
};
