const { GemeenteNijmegenCdkApp } = require('@gemeentenijmegen/modules-projen');
const project = new GemeenteNijmegenCdkApp({
  cdkVersion: '2.41.0',
  defaultReleaseBranch: 'production',
  release: true,
  majorVersion: 1,
  name: 'mijn-gegevens',
  license: 'EUPL-1.2',
  /* Runtime dependencies of this module. */
  deps: [
    '@gemeentenijmegen/modules-projen',
    'dotenv',
    '@aws-cdk/aws-apigatewayv2-alpha',
    '@aws-cdk/aws-apigatewayv2-integrations-alpha',
    '@aws-solutions-constructs/aws-lambda-dynamodb',
  ],
  devDeps: [
    'copyfiles',
  ],
  depsUpgradeOptions: {
    workflowOptions: {
      branches: ['acceptance'],
    },
  },
  mutableBuild: true,
  jestOptions: {
    jestConfig: {
      setupFiles: ['dotenv/config'],
      testPathIgnorePatterns: ['/node_modules/', '/cdk.out'],
      roots: ['src', 'test'],
    },
  },
  scripts: {
    'install:persoonsgegevens': 'copyfiles -f src/shared/* src/app/persoonsgegevens/shared && cd src/app/persoonsgegevens && npm install',
    'postinstall': 'npm run install:persoonsgegevens',
    'post-upgrade': 'cd src/app/persoonsgegevens && npx npm-check-updates --upgrade --target=minor',
  },
  eslintOptions: {
    devdirs: ['src/app/persoonsgegevens/tests', '/test', '/build-tools'],
  },
  gitignore: [
    '.env',
    '.vscode',
    'src/app/**/shared',
    '.DS_Store',
    'src/app/**/tests/output',
  ],
});
project.synth();