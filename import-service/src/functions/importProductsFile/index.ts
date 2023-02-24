import { handlerPath } from '@libs/handler-resolver';
// import { PRODUCT_BUCKET_NAME } from "../../../../utils";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'import',
                cors: true,
            },
            // s3: {
            //     bucket: PRODUCT_BUCKET_NAME,
            //     event: "s3:OblectCreated:*",
            //     rules: {
            //         prefix: "uploaded/{fileName}"
            //     },
            //     existing: true
            // }
        },
    ],
};
