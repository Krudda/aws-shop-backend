import type { AWS } from '@serverless/typescript';
import { createProduct, getMoviesList, getMovieById } from '@functions/index';

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
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 'dynamodb:*',
                Resource: ['*'],
            },
        ],
    },
    functions: {
        getMoviesList,
        getMovieById,
        createProduct
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
