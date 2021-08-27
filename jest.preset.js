const nxPreset = require('@nrwl/jest/preset');

module.exports = { ...nxPreset, coveragePathIgnorePatterns: ['.fixture.ts', 'index-test.ts'] };
