import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from '@aws-cdk/core';
import { App, CfnParameter, Duration, Stack, StackProps } from '@aws-cdk/core';

export class CdkStack extends Stack {
    constructor(scope: App, id: string, props: StackProps) {
        super(scope, id, props);

        new CfnParameter(this, 'AppId');

        // The code will be uploaded to this location during the pipeline's build step
        const artifactBucket = s3.Bucket.fromBucketName(this as Construct, 'ArtifactBucket', process.env.S3_BUCKET!);
        const artifactKey = `${process.env.CODEBUILD_BUILD_ID}/function-code.zip`;
        const code = lambda.Code.fromBucket(artifactBucket, artifactKey);
        
        
        const environment = { };
        const trendingFunction = new lambda.Function(this as Construct, 'trending', {
            description: 'Gets a list of trending movies for the week from TMDB.',
            handler: 'src/handlers/trending.trending',
            runtime: lambda.Runtime.NODEJS_14_X,
            code,
            environment,
            timeout: Duration.seconds(60),
        });
                
        
        const searchFunction = new lambda.Function(this as Construct, 'search', {
            description: 'Runs a search against TMDB by submitting user-provided keywords',
            handler: 'src/handlers/search.search',
            runtime: lambda.Runtime.NODEJS_14_X,
            code,
            timeout: Duration.seconds(60),
            environment,
        });


        const movieDetailsFunction = new lambda.Function(this as Construct, 'movieDetails', {
            description: 'Get the details for a given movie from the TMDB.',
            handler: 'src/handlers/movieDetails.movieDetails',
            runtime: lambda.Runtime.NODEJS_14_X,
            code,
            timeout: Duration.seconds(60),
            environment,
        });

        const api = new apigateway.RestApi(this, 'ServerlessRestApi', { cloudWatchRole: false });
        api.root.addMethod('GET', new apigateway.LambdaIntegration(trendingFunction));        
        api.root.addResource('{keywords}').addMethod('GET', new apigateway.LambdaIntegration(searchFunction));
        api.root.addResource('{movieID}').addMethod('GET', new apigateway.LambdaIntegration(movieDetailsFunction));
    }
}
