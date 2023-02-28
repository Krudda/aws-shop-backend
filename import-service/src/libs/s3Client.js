import { S3Client } from "@aws-sdk/client-s3";
import { DEFAULT_REGION } from "../../../utils";

const s3Client = new S3Client({ region: DEFAULT_REGION });
export { s3Client };