import * as apigw from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';


/**
 * A Stack for our simple Lambda-powered web service
 */

export class CdkpipelinesDemoStack extends Stack {
  /**
   * The Url of the API Gateway endpoint, for use in the integ tests
   */
  public readonly urlOutPut: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps){
    super(scope, id, props);

    // The Lambda function that contains the functionality
    const handler = new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
    });

    // An API Gateway to make the Lambda web-accessible
    const gw = new apigw.LambdaRestApi(this, 'Gateway', {
      description: 'Endpoint for a simple Lambda-powered web service',
      handler,
    });

    this.urlOutPut = new CfnOutput(this, 'Url', {
      value: gw.url
    });
  }
}
