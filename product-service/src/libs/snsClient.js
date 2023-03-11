import  { SNSClient } from "@aws-sdk/client-sns";
import { DEFAULT_REGION } from "../../../utils";

const snsClient = new SNSClient({ region: DEFAULT_REGION });
export  { snsClient };