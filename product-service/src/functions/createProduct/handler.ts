import { error500Response, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { addMovieService } from '@products/productHandlers';
import { APIGatewayProxyHandler } from 'aws-lambda';

const createProduct: APIGatewayProxyHandler = async (event) => {
  const { body } = event;
  console.log('body', body)
  try {
    const res = await addMovieService(body);
    console.log('res', res);
    return formatJSONResponse({ body });
  } catch (error) {
    console.log('error', error)
    return error500Response();
  }
}

export const main = middyfy(createProduct);
