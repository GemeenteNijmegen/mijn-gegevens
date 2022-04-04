import * as path from 'path';
import { aws_lambda as Lambda, aws_dynamodb } from 'aws-cdk-lib';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface ApiFunctionProps {
  description: string;
  codePath: string;
  table: aws_dynamodb.ITable;
  tablePermissions: string;
  applicationUrlBase?: string;
  environment?: {[key: string]: string};
}

export class ApiFunction extends Construct {
  lambda: Lambda.Function;
  constructor(scope: Construct, id: string, props: ApiFunctionProps) {
    super(scope, id);
    // See https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versionsx86-64.html
    const insightsArn = 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:16';
    this.lambda = new Lambda.Function(this, 'lambda', {
      runtime: Lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      description: props.description,
      logRetention: RetentionDays.ONE_MONTH,
      code: Lambda.Code.fromAsset(path.join(__dirname, props.codePath)),
      insightsVersion: Lambda.LambdaInsightsVersion.fromInsightVersionArn(insightsArn),
      environment: {
        SESSION_TABLE: props.table.tableName,
        ...props.environment,
      },
    });
    props.table.grantReadWriteData(this.lambda.grantPrincipal);
  }
}
