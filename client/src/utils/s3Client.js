import AWS from 'aws-sdk';

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

export const uploadFileToS3 = (file,callback) => {
    const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: S3_BUCKET,
        Key: file.name
    };

    try{
        myBucket.putObject(params)
            .send((err, data)=>{
                console.log(data)
                callback()
            })
    }catch (err){
        console.log(err)
    }

}