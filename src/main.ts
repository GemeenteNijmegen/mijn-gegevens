import { App } from 'aws-cdk-lib';
import * as Dotenv from 'dotenv';
import { PipelineStack } from './PipelineStack';
import { PipelineStackAcceptance } from './PipelineStackAcceptance';
import { PipelineStackDevelopment } from './PipelineStackDevelopment';
import { PipelineStackProduction } from './PipelineStackProduction';

// for development, use sandbox account
const deploymentEnvironment = {
  account: '418648875085',
  region: 'eu-west-1',
};

const sandboxEnvironment = {
  account: '122467643252',
  region: 'eu-west-1',
};

const acceptanceEnvironment = {
  account: '315037222840',
  region: 'eu-west-1',
};

const productionEnvironment = {
  account: '196212984627',
  region: 'eu-west-1',
};

const gnBuildEnvironment = {
  account: '836443378780',
  region: 'eu-central-1',
};

const gnMijnNijmegenAccpEnvironment = {
  account: '021929636313',
  region: 'eu-central-1',
};

const gnMijnNijmegenProdEnvironment = {
  account: '740606269759',
  region: 'eu-central-1',
};

Dotenv.config();
const app = new App();

if ('BRANCH_NAME' in process.env == false || process.env.BRANCH_NAME == 'development') {
  new PipelineStackDevelopment(app, 'mijn-persoonsgegevens-pipeline-development',
    {
      env: deploymentEnvironment,
      branchName: 'development',
      deployToEnvironment: sandboxEnvironment,
    },
  );
} else if (process.env.BRANCH_NAME == 'acceptance') {
  new PipelineStackAcceptance(app, 'mijn-persoonsgegevens-pipeline-acceptance',
    {
      env: deploymentEnvironment,
      branchName: 'acceptance',
      deployToEnvironment: acceptanceEnvironment,
    },
  );
} else if (process.env.BRANCH_NAME == 'acceptance-new-lz') {
  new PipelineStack(app, 'mijn-persoonsgegevens-pipeline-acceptance-new-lz',
    {
      env: gnBuildEnvironment,
      branchName: 'acceptance-new-lz',
      deployToEnvironment: gnMijnNijmegenAccpEnvironment,
    },
  );
} else if (process.env.BRANCH_NAME == 'production') {
  new PipelineStackProduction(app, 'mijn-persoonsgegevens-pipeline-production',
    {
      env: deploymentEnvironment,
      branchName: 'production',
      deployToEnvironment: productionEnvironment,
    },
  );
} else if (process.env.BRANCH_NAME == 'production-new-lz') {
  new PipelineStack(app, 'mijn-persoonsgegevens-pipeline-production-new-lz',
    {
      env: gnBuildEnvironment,
      branchName: 'production-new-lz',
      deployToEnvironment: gnMijnNijmegenProdEnvironment,
    },
  );
}

app.synth();