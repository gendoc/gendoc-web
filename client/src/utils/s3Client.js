import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const ACCESS_KEY = process.env.REACT_APP_AWS_S3_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_S3_SECRET_KEY;
const REGION = "ap-northeast-2";
const S3_BUCKET = 'gendoc-prod';


AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
});



const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
});

export const uploadFileToS3 = async (file) => {
    const uniqueId = uuidv4();

    const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: S3_BUCKET,
        Key: uniqueId,
    };

    try {
        await myBucket.putObject(params).promise();
        return uniqueId;
    } catch (err) {
        console.log(err);
        throw err;
    }
};