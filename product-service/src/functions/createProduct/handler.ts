import { error500Response, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getAllMoviesService } from '@products/productHandlers';
import { APIGatewayProxyResult } from 'aws-lambda';

const createProduct = async (): Promise<APIGatewayProxyResult> => {
  try {
    const movies = await getAllMoviesService();
    return formatJSONResponse({ body: movies });
  } catch (error) {
    return error500Response();
  }
}

export const main = middyfy(createProduct);
