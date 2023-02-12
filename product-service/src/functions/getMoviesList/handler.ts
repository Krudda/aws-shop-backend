import { error500Response, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getAllMoviesService } from '@products/productHandlers';

const getMoviesList = async () => {
  try {
    const movies = getAllMoviesService();
    return formatJSONResponse({ body: movies });
  } catch (error) {
    return error500Response();
  }
};

export const main = middyfy(getMoviesList);
