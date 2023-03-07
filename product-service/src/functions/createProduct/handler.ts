import { v4 as generateId } from 'uuid';
import { ddbDocClient } from "@libs/ddbDocClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { middyfy } from '@libs/lambda';
import { PRODUCT_TABLE_NAME, STOCKS_TABLE_NAME } from "../../../../utils";
import { Movie } from '@products/types';

const addMovieService = async (rawMovie: Movie) => {
	const { count, ...movie } = rawMovie;
	try {
		const movieID = generateId();
		const addMovie = new PutCommand({
			TableName: PRODUCT_TABLE_NAME,
			Item: { id: movieID, ...movie },
		});
		const addMovieCount = new PutCommand({
			TableName: STOCKS_TABLE_NAME,
			Item: { product_id: movieID, count },
		});
		await ddbDocClient.send(addMovie);
		await ddbDocClient.send(addMovieCount);
	} catch (err) {
		throw new Error(err);
	}
};

export const createProduct = async (movie: Movie) => {
	try {
		await addMovieService(movie);
		return true;
	} catch (error) {
		return false;
	}
}

export const main = middyfy(createProduct);
