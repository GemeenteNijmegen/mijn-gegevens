import { Stack, StackProps, Tags, pipelines, CfnParameter } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';
import { ParameterStage } from './ParameterStage';
import { PersoonsgegevensApiStage } from './PersoonsgegevensApiStage';
import { Statics } from './statics';

export interface PipelineStackProps extends StackProps, Configurable {}

export class PipelineStack extends Stack {

  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);
    Tags.of(this).add('cdkManaged', 'yes');
    Tags.of(this).add('Project', Statics.projectName);

    const pipeline = this.pipeline(props);
    pipeline.addStage(new ParameterStage(this, 'mijn-gegevens-parameters', {
      env: props.configuration.deploymentEnvironment,
      configuration: props.configuration,
    }));
    pipeline.addStage(new PersoonsgegevensApiStage(this, 'mijn-gegevens-api', {
      env: props.configuration.deploymentEnvironment,
      configuration: props.configuration,
    }));
  }

  pipeline(props: PipelineStackProps): pipelines.CodePipeline {
    const connectionArn = new CfnParameter(this, 'connectionArn');
    const source = pipelines.CodePipelineSource.connection('GemeenteNijmegen/mijn-gegevens', props.configuration.branchName, {
      connectionArn: connectionArn.valueAsString,
    });
    const pipeline = new pipelines.CodePipeline(this, props.configuration.pipelineName, {
      pipelineName: props.configuration.pipelineName,
      dockerEnabledForSelfMutation: true,
      dockerEnabledForSynth: true,
      crossAccountKeys: true,
      synth: new pipelines.ShellStep('Synth', {
        input: source,
        env: {
          BRANCH_NAME: props.configuration.branchName,
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