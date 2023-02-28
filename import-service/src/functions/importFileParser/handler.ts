import { error500Response, formatJSONResponse } from '@libs/api-gateway';
import {
    GetObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3';
import csv from 'csv-parser';
import { s3Client } from "@libs/s3Client";
import { PRODUCT_BUCKET_NAME } from "../../../../utils";

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
                    console.log("Start copying file");
                    await s3Client.send(copyCommand);
                    console.log("Finish copying file");

                    console.log("Start deleting file");
                    await s3Client.send(deleteCommand);
                    console.log("Finish deleting file");
                }
                catch (err) {
                    console.log("Error during file transfer", err);
                }
            }

            const streamProcessing = async (stream: NodeJS.ReadableStream) => {
                return new Promise<void>((resolve, reject) => {
                    stream
                        .pipe(csv())
                        .on('data', (data) => {
                            console.log('file data', data);
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
