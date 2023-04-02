import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as apigatewayV2 from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export class AppStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const func = new lambda.Function(this, "lambda", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("../back-end/dist-lambda/lambda.zip"),
      handler: "dist/lambda.handler",
    });

    const api = new apigatewayV2.HttpApi(this, "api", {
      defaultIntegration: new HttpLambdaIntegration(
        "api-lambda-integration",
        func
      ),
      corsPreflight: {
        allowHeaders: ["Authorization"],
        allowMethods: [apigatewayV2.CorsHttpMethod.ANY],
        allowOrigins: ["*"],
        maxAge: cdk.Duration.days(10),
      },
    });

    const myBucket = new s3.Bucket(this, "front-end-bucket", {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
    });

    new s3Deployment.BucketDeployment(this, "deployStaticWebsite", {
      sources: [
        s3Deployment.Source.asset("../front-end/dist"),
        s3Deployment.Source.jsonData("config.json", { apiUrl: api.url }),
      ],
      destinationBucket: myBucket,
    });
  }
}
