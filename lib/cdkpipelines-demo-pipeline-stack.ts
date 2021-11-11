import { Construct, SecretValue, Stack, StackProps} from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep, ShellScriptAction } from '@aws-cdk/pipelines';
import { CdkpipelinesDemoStage } from './cdkpipelines-demo-stage';

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelineDemoPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            // The pipeline name
            pipelineName: 'MyServicePipeline',

            // How it will be built and synthesised
            synth: new ShellStep('Synth', {
                // Where the source can be found
                input: CodePipelineSource.gitHub('rodders110/cdkpipelines-demo', 'master'),

                // Install dependencies, build and run cdk synth
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ],
            }),
        });

        // This is where we add the application stages
        // ...

        // pipeline.addStage(new CdkpipelinesDemoStage(this, 'PreProd', {
        //     env: { account: '227367310677', region: 'eu-west-1' }
        // }))

        const preprod = new CdkpipelinesDemoStage(this, 'PreProd', {
            env: { account: '227367310677', region: 'eu-west-1' }
        });

        const preprodStage = pipeline.addStage(preprod, {
            post : [
                new ShellStep('TestService', {
                    commands : [
                        // Use 'curl' to GET the given URL and fail if it returns an error
                        'curl -Ssf $ENDPOINT_URL'
                    ],
                    envFromCfnOutputs: {
                        // Get the stack Output fron the stage and make it available in
                        // the shell script as $ENDPOINT_URL.
                        ENDPOINT_URL: preprod.urlOutput
                    },
                }),
            ],
        });
    }
}