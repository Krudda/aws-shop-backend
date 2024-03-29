import type { AWS } from '@serverless/typescript';
import { getProductsFile, importProductsFile, importFileParser } from '@functions/index';

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            SQS_URL: '${cf:product-service-${self:provider.stage}.SQSQueueUrl}'
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 's3:ListBucket',
                Resource: ['arn:aws:s3:::aws-krudda-first-app-upload'],
            },
            {
                Effect: 'Allow',
                Action: 's3:*',
                Resource: ['arn:aws:s3:::aws-krudda-first-app-upload/*'],
            },
            {
                Effect: 'Allow',
                Action: 'sqs:*',
                Resource: ['${cf:product-service-${self:provider.stage}.SQSQueueArn}'],
            },
        ],
    },
    resources: {
        Resources: {
            GatewayResponseDefault4XX: {
                Type: "AWS::ApiGateway::GatewayResponse",
                Properties: {
                    ResponseParameters: {
                        "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
                        "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
                    },
                    ResponseType: "DEFAULT_4XX",
                    RestApiId: {
                        Ref: "ApiGatewayRestApi",
                    },
                },
            },
        },
    },
    functions: {
        importProductsFile,
        getProductsFile,
        importFileParser
    },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
