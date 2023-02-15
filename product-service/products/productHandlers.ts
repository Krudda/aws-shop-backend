import { splitEvery } from "ramda";
import { Movie } from './types';
import { ddbClient } from "@libs/ddbClient";
import { ddbDocClient } from "@libs/ddbDocClient";
import { ScanCommand, GetCommand, PutCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as generateId } from 'uuid';
import { PRODUCT_TABLE_NAME } from "../../utils";

export const getAllMoviesService = async () => {
    const { Items } = await ddbClient.send(new ScanCommand({
        TableName: PRODUCT_TABLE_NAME
    }))
    return Items;
}

export const getMovieService = async (id: string) => {
    const { Item } = await ddbDocClient.send(
        new GetCommand({
            TableName: PRODUCT_TABLE_NAME,
            Key: {
                id
            },
        })
    );
    return Item;
};

export const addMovieService = async (movie: Movie) => {
    try {
        const command = new PutCommand({
            TableName: PRODUCT_TABLE_NAME,
            Item: { id: generateId(), ...movie },
        });
        const data = await ddbDocClient.send(command);
        return data;
    } catch (err) {
        console.error(err);
    }
};

//Script to fill DB with values
export const batchWriteMovies = async (moviesToLoad: Movie[]) => {
    const putMovieRequestItems = moviesToLoad.map(movie => ({
        PutRequest: { Item: { id: generateId(), ...movie } },
    }));

    const putMovieBatches = splitEvery(25, putMovieRequestItems);

    const batchRequests = putMovieBatches.map(async (batch) => {
        const command = new BatchWriteCommand({
            RequestItems: {
                [PRODUCT_TABLE_NAME]: batch
            },
        });

        await ddbDocClient.send(command)
    });

    await Promise.all(batchRequests);
};