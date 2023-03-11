import { error500Response, formatJSONResponse } from '@libs/api-gateway';
import { snsClient } from "@libs/snsClient";
import { Movie } from "@products/types";
import { PublishCommand } from '@aws-sdk/client-sns';
import { createProduct } from "../createProduct/handler"

const catalogBatchProcess = async event => {

	try {
		const movies: Movie[] = event.Records.map(({ body }) => JSON.parse(body));

		for (const movie of movies) {
			const { title, poster, price, count } = movie;
			const movieIsValid = Boolean(title && poster && price && count);

			if (!movieIsValid) {
				return
			}

			const movieIsAdded = await createProduct(movie);

			if (movieIsAdded) {
				const message = {
					Subject: 'New movie was added',
					Message: JSON.stringify(movie),
					TopicArn: process.env.SNS_ARN,
					MessageAttributes: {
						movieType: {
							DataType: 'String',
							StringValue: movie.type
						},
					},
				};
				const command = new PublishCommand(message);
				await snsClient.send(command);
			}
		}
		return formatJSONResponse({ message: "Messages sended" });
	} catch (error) {
		console.log('catalogBatchProcess error: ', error);
		return error500Response();
	}
};

export const main = catalogBatchProcess;
