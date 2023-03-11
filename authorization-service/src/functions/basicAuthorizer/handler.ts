import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";

const generatePolicy = (principalId, resource, access = 'Allow') => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: access,
                    Resource: resource
                }
            ],
        },
    };
};

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent, _, callback) => {
    console.log('event !!!', JSON.stringify(event));
    const { type, authorizationToken, methodArn } = event;

    if (type !== 'TOKEN') { callback('Unauthorized') }

    try {
        const encodedToken = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedToken, 'base64');
        const plainCreds = buff.toString('utf-8');
        const [userName, userPassword] = plainCreds.split(':');

        console.log(`Username: ${userName}, Password: ${userPassword}`);

        const storedUserPassword = process.env[userName];

        console.log('storedUserPassword', storedUserPassword);

        const effect =
            !storedUserPassword || storedUserPassword !== userPassword
                ? 'Deny'
                : 'Allow'

        const policy = generatePolicy(encodedToken, methodArn, effect);
        callback(null, policy);

    } catch (error) {
        callback(`Unauthorized: ${error.message}`)
    }
};

export const main = basicAuthorizer;