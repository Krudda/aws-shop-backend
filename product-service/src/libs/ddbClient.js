import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DEFAULT_REGION } from "../../../utils";

export const ddbClient = new DynamoDBClient({ region: DEFAULT_REGION });
