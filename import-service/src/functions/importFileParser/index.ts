import { handlerPath } from '@libs/handler-resolver';
// import { PRODUCT_BUCKET_NAME } from "../../../../utils";


export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            s3: {
                bucket: 'aws-krudda-first-app-upload',
                event: 's3:ObjectCreated:*',
                rules: [{
                    prefix: 'uploaded/',
                }],
                existing: true,
            },
        },
    ],
};
