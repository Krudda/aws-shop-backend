import  { SQSClient } from "@aws-sdk/client-sqs";
import { DEFAULT_REGION } from "../../../utils";

const sqsClient = new SQSClient({ region: DEFAULT_REGION });

export  { sqsClient };