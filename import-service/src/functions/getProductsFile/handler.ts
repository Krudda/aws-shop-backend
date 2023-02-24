import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@libs/s3Client";
import { PRODUCT_BUCKET_NAME } from "../../../../utils";

import { APIGatewayProxyHandler } from 'aws-lambda';

const bucketParams = { Bucket: PRODUCT_BUCKET_NAME };

const getProductsFile: APIGatewayProxyHandler = async () => {
  try {
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));
    console.log("Success", data);
    const files = data.Contents.filter(file => file.Size > 0) || [];
    return formatJSONResponse(files.length ? files : { message: "No files uploaded yet." })
  } catch (err) {
    console.log("Error", err);
  }
};

export const main = middyfy(getProductsFile);
