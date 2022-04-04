import { Stack, StackProps, Tags, pipelines, CfnParameter, Environment } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ParameterStage } from './ParameterStage';
import { PersoonsgegevensApiStage } from './PersoonsgegevensApiStage';
import { Statics } from './statics';

export interface PipelineStackProps extends StackProps{
  branchName: string;
  deployToEnvironment: Environment;
}

export class PipelineStack extends Stack {
  branchName: string;
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);
    Tags.of(this).add('cdkManaged', 'yes');
    Tags.of(this).add('Project', Statics.projectName);
    this.branchName = props.branchName;
    const pipeline = this.pipeline();
    pipeline.addStage(new ParameterStage(this, 'mijn-persoonsgegevens-parameters', { env: props.deployToEnvironment }));
    pipeline.addStage(new PersoonsgegevensApiStage(this, 'mijn-persoonsgegevens-api', { env: props.deployToEnvironment, branch: this.branchName }));
  }

  pipeline(): pipelines.CodePipeline {
    const connectionArn = new CfnParameter(this, 'connectionArn');
    const source = pipelines.CodePipelineSource.connection('GemeenteNijmegen/mijn-persoonsgegevens', this.branchName, {
      connectionArn: connectionArn.valueAsString,
    });
    const pipeline = new pipelines.CodePipeline(this, `mijnpersoonsgegevens-${this.branchName}`, {
      pipelineName: `mijnpersoonsgegevens-${this.branchName}`,
      dockerEnabledForSelfMutation: true,
      dockerEnabledForSynth: true,
      crossAccountKeys: true,
      synth: new pipelines.ShellStep('Synth', {
        input: source,
        env: {
          BRANCH_NAME: this.branchName,
        },
        commands: [
          'yarn install --frozen-lockfile',
          'npx projen build',
          'npx projen synth',
        ],
      }),
    });
    return pipeline;
  }
}