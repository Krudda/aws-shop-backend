import { error500Response, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {
    GetObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import csv from 'csv-parser';
import { s3Client } from "@libs/s3Client";
import { PRODUCT_BUCKET_NAME } from "../../../../utils";
import { pipeline } from 'stream';

const importFileParser = async (event) => {
    try {
        for (let record of event.Records) {
            const objectKey = record.s3.object.key;

            const command = new GetObjectCommand({
                Bucket: PRODUCT_BUCKET_NAME,
                Key: objectKey,
            });

            const data = await s3Client.send(command);

            const transferUploadedFile = async () => {
                console.log("Start copy file");

                const copyCommand = new CopyObjectCommand({
                    Bucket: PRODUCT_BUCKET_NAME,
                    CopySource: `/${PRODUCT_BUCKET_NAME}/${objectKey}`,
                    Key: objectKey.replace('uploaded', 'parsed'),
                });

                const resCopyFile = await s3Client.send(copyCommand);
                console.log("Finish copy file", resCopyFile);

                console.log("objectKey222", objectKey);
                const deleteCommand = new DeleteObjectCommand({
                    Bucket: PRODUCT_BUCKET_NAME,
                    Key: objectKey,
                });

                console.log("Start delete uploaded file");
                const resDeletingFile = await s3Client.send(deleteCommand);
                console.log("Finish delete file", resDeletingFile);
            }

            // const deleteUploadedFile = async () => {
            //     console.log("Start delete file");

            //     const deleteCommand = new DeleteObjectCommand({
            //         Bucket: PRODUCT_BUCKET_NAME,
            //         Key: objectKey,
            //     });

            //     await s3Client.send(deleteCommand);
            // }

            // const transferFile = async () => {
            //     await copyUploadedFile();
            //     await deleteUploadedFile();
            // }

            const streamProcessing = async (stream: NodeJS.ReadableStream) => {
                try {
                    pipeline(
                        stream,
                        csv(),
                        transferUploadedFile
                    )
                } catch (error) {
                    console.log('error in try/catch statement', error);
                }

            };

            await streamProcessing(data.Body);
        }
        // return formatJSONResponse({ message: "The file uploaded" })
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE",
                "Access-Control-Expose-Headers": "*",
                Allow: "GET, PUT, POST, DELETE",
            },
            body: JSON.stringify({ message: "The file uploaded" }),
        };
    } catch (err) {
        console.log('error!!!!!!!!!!!!!', err);
        // return error500Response("Error importProductsFile")
    }
};

export const main = importFileParser;
