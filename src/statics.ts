export abstract class Statics {
  static readonly projectName: string = 'mijn-gegevens';

  /**
   * Imported arns from Mijn Nijmegen
   */
  static readonly ssmApiGatewayId: string = '/cdk/mijn-nijmegen/apigateway-id';
  static readonly ssmSessionsTableArn: string = '/cdk/mijn-nijmegen/sessionstable-arn';
  static readonly ssmDataKeyArn: string = '/cdk/mijn-nijmegen/kms-datakey-arn';
  static readonly ssmReadOnlyRoleArn: string = '/cdk/mijn-nijmegen/role-readonly-arn';

  /**
   * Certificate private key for mTLS
   */
  static readonly secretMTLSPrivateKey: string = '/cdk/mijn-gegevens/mtls-privatekey';

  /**
   * Certificate for mTLS
   */
  static readonly ssmMTLSClientCert: string = '/cdk/mijn-gegevens/mtls-clientcert';

  /**
    * Root CA for mTLS (PKIO root)
    */
  static readonly ssmMTLSRootCA: string = '/cdk/mijn-gegevens/mtls-rootca';

  /**
   * BRP API endpoint
   */
  static readonly ssmBrpApiEndpointUrl: string = '/cdk/mijn-gegevens/brp-api-url';

  // ENVIRONMENTS

  static readonly deploymentEnvironment = {
    account: '418648875085',
    region: 'eu-west-1',
  };

  static readonly sandboxEnvironment = {
    account: '122467643252',
    region: 'eu-west-1',
  };

  static readonly acceptanceEnvironment = {
    account: '315037222840',
    region: 'eu-west-1',
  };

  static readonly productionEnvironment = {
    account: '196212984627',
    region: 'eu-west-1',
  };

  static readonly gnBuildEnvironment = {
    account: '836443378780',
    region: 'eu-central-1',
  };

  static readonly gnMijnNijmegenAccpEnvironment = {
    account: '021929636313',
    region: 'eu-central-1',
  };

  static readonly gnMijnNijmegenProdEnvironment = {
    account: '740606269759',
    region: 'eu-central-1',
  };

}