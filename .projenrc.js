const { GemeenteNijmegenCdkApp } = require('@gemeentenijmegen/projen-project-type');
const project = new GemeenteNijmegenCdkApp({
  cdkVersion: '2.41.0',
  defaultReleaseBranch: 'production',
  majorVersion: 1,
  name: 'mijn-gegevens',
  /* Runtime dependencies of this module. */
  deps: [
    '@gemeentenijmegen/projen-project-type',
    'dotenv',
    '@aws-cdk/aws-apigatewayv2-alpha',
    '@aws-cdk/aws-apigatewayv2-integrations-alpha',
    '@aws-solutions-constructs/aws-lambda-dynamodb',
  ],
  devDeps: [
    'copyfiles',
  ],
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