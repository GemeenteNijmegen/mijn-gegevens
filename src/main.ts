import { App } from 'aws-cdk-lib';
import * as Dotenv from 'dotenv';
import { PipelineStack } from './PipelineStack';
import { Statics } from './statics';

Dotenv.config();
const app = new App();

if ('BRANCH_NAME' in process.env == false || process.env.BRANCH_NAME == 'development') {
  new PipelineStack(app, 'mijn-persoonsgegevens-pipeline-development',
    {
      env: Statics.deploymentEnvironment,
      branchName: 'development',
      deployToEnvironment: Statics.sandboxEnvironment,
    },
  );
} else if (process.env.BRANCH_NAME == 'acceptance') {
  new PipelineStack(app, 'mijn-persoonsgegevens-pipeline-acceptance',
    {
      env: Statics.deploymentEnvironment,
      branchName: 'acceptance',
      deployToEnvironment: Statics.acceptanceEnvironment,
    },
  );
} else if (process.env.BRANCH_NAME == 'acceptance-new-lz') {
  new PipelineStack(app, 'mijn-persoonsgegevens-pipeline-acceptance-new-lz',
    {
      env: Statics.gnBuildEnvironment,
      branchName: 'acceptance-new-lz',
      deployToEnvironment: Statics.gnMijnNijmegenAccpEnvironment,
    },
  );
} else if (process.env.BRANCH_NAME == 'production') {
  new PipelineStack(app, 'mijn-persoonsgegevens-pipeline-production',
    {
      env: Statics.deploymentEnvironment,
      branchName: 'production',
      deployToEnvironment: Statics.productionEnvironment,
    },
  );
} else if (process.env.BRANCH_NAME == 'production-new-lz') {
  new PipelineStack(app, 'mijn-persoonsgegevens-pipeline-production-new-lz',
    {
      env: Statics.gnBuildEnvironment,
      branchName: 'production-new-lz',
      deployToEnvironment: Statics.gnMijnNijmegenProdEnvironment,
    },
  );
}

app.synth();