const nxPreset = require('@nrwl/jest/preset').default;


module.exports = { ...nxPreset, coveragePathIgnorePatterns: ['.fixture.ts', 'index-test.ts'] };
