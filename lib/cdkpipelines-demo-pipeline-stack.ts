import { Construct, SecretValue, Stack, StackProps} from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';

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
                input: CodePipelineSource.gitHub("rodders110/cdkpipelines-demo", 'main'),

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
    }
}