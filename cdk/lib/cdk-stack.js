"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStack = void 0;
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
class CdkStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new core_1.CfnParameter(this, 'AppId');
        // The code will be uploaded to this location during the pipeline's build step
        const artifactBucket = s3.Bucket.fromBucketName(this, 'ArtifactBucket', process.env.S3_BUCKET);
        const artifactKey = `${process.env.CODEBUILD_BUILD_ID}/function-code.zip`;
        const code = lambda.Code.fromBucket(artifactBucket, artifactKey);
        const environment = {};
        const trendingFunction = new lambda.Function(this, 'trending', {
            description: 'Gets a list of trending movies for the week from TMDB.',
            handler: 'src/handlers/trending.trending',
            runtime: lambda.Runtime.NODEJS_14_X,
            code,
            environment,
            timeout: core_1.Duration.seconds(60),
        });
        const searchFunction = new lambda.Function(this, 'search', {
            description: 'Runs a search against TMDB by submitting user-provided keywords',
            handler: 'src/handlers/search.search',
            runtime: lambda.Runtime.NODEJS_14_X,
            code,
            timeout: core_1.Duration.seconds(60),
            environment,
        });
        const movieDetailsFunction = new lambda.Function(this, 'movieDetails', {
            description: 'Get the details for a given movie from the TMDB.',
            handler: 'src/handlers/movieDetails.movieDetails',
            runtime: lambda.Runtime.NODEJS_14_X,
            code,
            timeout: core_1.Duration.seconds(60),
            environment,
        });
        const api = new apigateway.RestApi(this, 'ServerlessRestApi', { cloudWatchRole: false });
        api.root.addMethod('GET', new apigateway.LambdaIntegration(trendingFunction));
        api.root.addResource('{keywords}').addMethod('GET', new apigateway.LambdaIntegration(searchFunction));
        api.root.addResource('{movieID}').addMethod('GET', new apigateway.LambdaIntegration(movieDetailsFunction));
    }
}
exports.CdkStack = CdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFzRDtBQUN0RCw4Q0FBOEM7QUFDOUMsc0NBQXNDO0FBRXRDLHdDQUErRTtBQUUvRSxNQUFhLFFBQVMsU0FBUSxZQUFLO0lBQy9CLFlBQVksS0FBVSxFQUFFLEVBQVUsRUFBRSxLQUFpQjtRQUNqRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLG1CQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWhDLDhFQUE4RTtRQUM5RSxNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFpQixFQUFFLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBVSxDQUFDLENBQUM7UUFDN0csTUFBTSxXQUFXLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixvQkFBb0IsQ0FBQztRQUMxRSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFHakUsTUFBTSxXQUFXLEdBQUcsRUFBRyxDQUFDO1FBQ3hCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQWlCLEVBQUUsVUFBVSxFQUFFO1lBQ3hFLFdBQVcsRUFBRSx3REFBd0Q7WUFDckUsT0FBTyxFQUFFLGdDQUFnQztZQUN6QyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUk7WUFDSixXQUFXO1lBQ1gsT0FBTyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ2hDLENBQUMsQ0FBQztRQUdILE1BQU0sY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFpQixFQUFFLFFBQVEsRUFBRTtZQUNwRSxXQUFXLEVBQUUsaUVBQWlFO1lBQzlFLE9BQU8sRUFBRSw0QkFBNEI7WUFDckMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJO1lBQ0osT0FBTyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQzdCLFdBQVc7U0FDZCxDQUFDLENBQUM7UUFHSCxNQUFNLG9CQUFvQixHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFpQixFQUFFLGNBQWMsRUFBRTtZQUNoRixXQUFXLEVBQUUsa0RBQWtEO1lBQy9ELE9BQU8sRUFBRSx3Q0FBd0M7WUFDakQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJO1lBQ0osT0FBTyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQzdCLFdBQVc7U0FDZCxDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDekYsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDdEcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7SUFDL0csQ0FBQztDQUNKO0FBL0NELDRCQStDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXknO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQXBwLCBDZm5QYXJhbWV0ZXIsIER1cmF0aW9uLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG5leHBvcnQgY2xhc3MgQ2RrU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0YWNrUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAgICAgbmV3IENmblBhcmFtZXRlcih0aGlzLCAnQXBwSWQnKTtcblxuICAgICAgICAvLyBUaGUgY29kZSB3aWxsIGJlIHVwbG9hZGVkIHRvIHRoaXMgbG9jYXRpb24gZHVyaW5nIHRoZSBwaXBlbGluZSdzIGJ1aWxkIHN0ZXBcbiAgICAgICAgY29uc3QgYXJ0aWZhY3RCdWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldE5hbWUodGhpcyBhcyBDb25zdHJ1Y3QsICdBcnRpZmFjdEJ1Y2tldCcsIHByb2Nlc3MuZW52LlMzX0JVQ0tFVCEpO1xuICAgICAgICBjb25zdCBhcnRpZmFjdEtleSA9IGAke3Byb2Nlc3MuZW52LkNPREVCVUlMRF9CVUlMRF9JRH0vZnVuY3Rpb24tY29kZS56aXBgO1xuICAgICAgICBjb25zdCBjb2RlID0gbGFtYmRhLkNvZGUuZnJvbUJ1Y2tldChhcnRpZmFjdEJ1Y2tldCwgYXJ0aWZhY3RLZXkpO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGVudmlyb25tZW50ID0geyB9O1xuICAgICAgICBjb25zdCB0cmVuZGluZ0Z1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzIGFzIENvbnN0cnVjdCwgJ3RyZW5kaW5nJywge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdHZXRzIGEgbGlzdCBvZiB0cmVuZGluZyBtb3ZpZXMgZm9yIHRoZSB3ZWVrIGZyb20gVE1EQi4nLFxuICAgICAgICAgICAgaGFuZGxlcjogJ3NyYy9oYW5kbGVycy90cmVuZGluZy50cmVuZGluZycsXG4gICAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgICBlbnZpcm9ubWVudCxcbiAgICAgICAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHNlYXJjaEZ1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzIGFzIENvbnN0cnVjdCwgJ3NlYXJjaCcsIHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUnVucyBhIHNlYXJjaCBhZ2FpbnN0IFRNREIgYnkgc3VibWl0dGluZyB1c2VyLXByb3ZpZGVkIGtleXdvcmRzJyxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdzcmMvaGFuZGxlcnMvc2VhcmNoLnNlYXJjaCcsXG4gICAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgICAgICAgIGVudmlyb25tZW50LFxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGNvbnN0IG1vdmllRGV0YWlsc0Z1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzIGFzIENvbnN0cnVjdCwgJ21vdmllRGV0YWlscycsIHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnR2V0IHRoZSBkZXRhaWxzIGZvciBhIGdpdmVuIG1vdmllIGZyb20gdGhlIFRNREIuJyxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdzcmMvaGFuZGxlcnMvbW92aWVEZXRhaWxzLm1vdmllRGV0YWlscycsXG4gICAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgICAgICAgIGVudmlyb25tZW50LFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdTZXJ2ZXJsZXNzUmVzdEFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlIH0pO1xuICAgICAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHRyZW5kaW5nRnVuY3Rpb24pKTsgICAgICAgIFxuICAgICAgICBhcGkucm9vdC5hZGRSZXNvdXJjZSgne2tleXdvcmRzfScpLmFkZE1ldGhvZCgnR0VUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oc2VhcmNoRnVuY3Rpb24pKTtcbiAgICAgICAgYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3ttb3ZpZUlEfScpLmFkZE1ldGhvZCgnR0VUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24obW92aWVEZXRhaWxzRnVuY3Rpb24pKTtcbiAgICB9XG59XG4iXX0=