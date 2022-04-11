const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.20.0',
  cdkVersionPinning: true,
  defaultReleaseBranch: 'production',
  release: true,
  majorVersion: 1,
  name: 'mijn-gegevens',
  license: 'EUPL-1.2',
  /* Runtime dependencies of this module. */
  deps: [
    'dotenv',
    '@aws-cdk/aws-apigatewayv2-alpha',
    '@aws-cdk/aws-apigatewayv2-integrations-alpha',
    '@aws-solutions-constructs/aws-lambda-dynamodb@2.0.0',
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
    'install:persoonsgegevens': 'copyfiles -f src/shared/*.js src/app/persoonsgegevens/shared && cd src/app/persoonsgegevens && npm install',
    'postinstall': 'npm run install:persoonsgegevens',
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