import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PersoonsgegevensApiStack } from './PersoonsgegevensApiStack';

export interface GegevensApiStageProps extends StageProps {
  branch: string;
}

/**
 * Stage responsible for the API Gateway and lambdas
 */
export class PersoonsgegevensApiStage extends Stage {
  constructor(scope: Construct, id: string, props: GegevensApiStageProps) {
    super(scope, id, props);

    new PersoonsgegevensApiStack(this, 'persoonsgegevens-api');
  }
}