import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { middyfy } from '@libs/lambda';
import { s3Client } from "@libs/s3Client";
import { PRODUCT_BUCKET_NAME } from "../../../../utils";
import { APIGatewayProxyHandler } from 'aws-lambda';
import { error500Response, formatJSONResponse } from "@libs/api-gateway";

const importProductsFile: APIGatewayProxyHandler = async (event) => {
  const { name = '' } = event.queryStringParameters;

  const bucketParams = {
    Bucket: PRODUCT_BUCKET_NAME,
    Key: `uploaded/${name}`,
    ContentType: "text/csv"
  };

  try {
    const command = new PutObjectCommand(bucketParams);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return formatJSONResponse({ body: signedUrl })
  } catch (err) {
    return error500Response("Error importProductsFile")
  }
};

export const main = middyfy(importProductsFile);
