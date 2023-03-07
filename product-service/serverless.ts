import type { AWS } from '@serverless/typescript';
import { createProduct, getMoviesList, getMovieById, catalogBatchProcess } from '@functions/index';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '3',
    plugins: [
        'serverless-esbuild',
        'serverless-offline'
    ],
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
            tableName: 'Products',
            SQS_URL: {
                Ref: 'SQSQueue'
            },
            SNS_ARN: {
                Ref: "SNSTopic"
            }
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 'dynamodb:*',
                Resource: ['*'],
            },
            {
                Effect: 'Allow',
                Action: 'sns:*',
                Resource: {
                    Ref: "SNSTopic"
                },
            },
            {
                Effect: 'Allow',
                Action: 'sqs:*',
                Resource: { "Fn::GetAtt": ['SQSQueue', 'Arn'] },
            },
        ],
    },
    resources: {
        Resources: {
            SQSQueue: {
                Type: "AWS::SQS::Queue",
                Properties: {
                    QueueName: "catalogItemsQueue"
                }
            },
            SNSTopic: {
                Type: "AWS::SNS::Topic",
                Properties: {
                    TopicName: "createProductTopic"
                }
            },
            SNSSubscriptionMovie: {
                Type: "AWS::SNS::Subscription",
                Properties: {
                    Endpoint: "krudda.dev@gmail.com",
                    Protocol: "email",
                    TopicArn: {
                        Ref: "SNSTopic"
                    },
                    FilterPolicy: {
                        movieType: ["Movie"]
                    }
                }
            },
            SNSSubscriptionCartoons: {
                Type: "AWS::SNS::Subscription",
                Properties: {
                    Endpoint: "krudda@yandex.ru",
                    Protocol: "email",
                    TopicArn: {
                        Ref: "SNSTopic"
                    },
                    FilterPolicy: {
                        movieType: ["Animation"]
                    }
                }
            },
        },
        Outputs: {
            SQSQueueUrl: {
                Value: {
                    Ref: 'SQSQueue'
                }
            },
            SQSQueueArn: {
                Value: {
                    "Fn::GetAtt": ["SQSQueue", "Arn"]
                }
            }
        },
    },
    functions: {
        getMoviesList,
        getMovieById,
        createProduct,
        catalogBatchProcess
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
