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

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const root = path.join(__dirname, '../../apps/demo-e2e/src');

glob(`${root}/integration/**/*.spec.ts`, (err, files) => {
  let code = '';
  files.forEach(file => {
    code += `require('${file.replace(root, '..')}');\n`;
  });

  fs.writeFileSync(`${root}\\integration-local\\main.spec.ts`, code);
});

