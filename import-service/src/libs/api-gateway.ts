import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*'
};

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: { ...defaultHeaders },
    body: JSON.stringify(response)
  }
}

export const error404Response = (message: string) => errorResponseBuilder(404, message);
export const error500Response = (message?: string) => errorResponseBuilder(500, message);

const errorResponseBuilder = (statusCode: number, message?: string) => {
  const defaultMessage = 'Something went wrong'
  return {
    statusCode,
    body: JSON.stringify({ error: message || defaultMessage })
  }
}