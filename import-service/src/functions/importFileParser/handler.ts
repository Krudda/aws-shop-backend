import { error500Response, formatJSONResponse } from '@libs/api-gateway';
import {
    GetObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3';
import csv from 'csv-parser';
import { s3Client } from "@libs/s3Client";
import { sqsClient } from "@libs/sqsClient";
import { PRODUCT_BUCKET_NAME } from "../../../../utils";
import { SendMessageCommand } from '@aws-sdk/client-sqs';

const importFileParser = async (event) => {
    try {
        for (let record of event.Records) {
            const objectKey = record.s3.object.key;

            const getCommand = new GetObjectCommand({
                Bucket: PRODUCT_BUCKET_NAME,
                Key: objectKey,
            });

            const response = await s3Client.send(getCommand);

            const fileTransfer = async () => {
                const copyCommand = new CopyObjectCommand({
                    Bucket: PRODUCT_BUCKET_NAME,
                    CopySource: `${PRODUCT_BUCKET_NAME}/${objectKey}`,
                    Key: objectKey.replace('uploaded', 'parsed'),
                });

                const deleteCommand = new DeleteObjectCommand({
                    Bucket: PRODUCT_BUCKET_NAME,
                    Key: objectKey,
                });

                try {
                    await s3Client.send(copyCommand);
                    await s3Client.send(deleteCommand);
                }
                catch (err) {
                    console.log("Error during file transfer", err);
                }
            }

            const streamProcessing = async (stream: NodeJS.ReadableStream) => {
                return new Promise<void>((resolve, reject) => {
                    stream
                        .pipe(csv())
                        .on('data', async (data) => {
                            const sendMessageCommand = new SendMessageCommand({
                                MessageBody: JSON.stringify(data),
                                QueueUrl: process.env.SQS_URL,
                            })
                            try {
                                await sqsClient.send(sendMessageCommand);
                            } catch (err) {
                                console.log("Error", err);
                            }
                        })
                        .on('error', (err) => reject(err))
                        .on('end', async () => {
                            await fileTransfer();
                            resolve();
                        });
                });
            };

            await streamProcessing(response.Body);
        }
        return formatJSONResponse({ message: "The file uploaded" })
    } catch (err) {
        return error500Response("Error importProductsFile")
    }
};

export const main = importFileParser;
