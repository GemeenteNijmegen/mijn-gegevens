import { PermissionsBoundaryAspect } from '@gemeentenijmegen/aws-constructs';
import { Aspects, Stage, StageProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';
import { PersoonsgegevensApiStack } from './PersoonsgegevensApiStack';
import { Statics } from './statics';

export interface GegevensApiStageProps extends StageProps, Configurable {}

/**
 * Stage responsible for the API Gateway and lambdas
 */
export class PersoonsgegevensApiStage extends Stage {
  constructor(scope: Construct, id: string, props: GegevensApiStageProps) {
    super(scope, id, props);
    Tags.of(this).add('cdkManaged', 'yes');
    Tags.of(this).add('Project', Statics.projectName);
    if (props.configuration.envIsInNewLandingZone) {
      Aspects.of(this).add(new PermissionsBoundaryAspect());
    }


    new PersoonsgegevensApiStack(this, 'persoonsgegevens-api');
  }
}