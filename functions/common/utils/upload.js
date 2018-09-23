import AWS from 'aws-sdk';
import fileType from 'file-type';

export default async (attachment, dir = 'test') => {
  const S3 = new AWS.S3();

  try {
    const fileBuffer = Buffer.from(attachment, 'base64');
    const fileTypeInfo = fileType(fileBuffer);
    const filePath = `${dir}/${Math.floor(new Date() / 1000)}.${fileTypeInfo.ext}`;
    const params = {
      Bucket: process.env.ACHEEV_BUCKET,
      Key: filePath,
      Body: fileBuffer,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: fileTypeInfo.mime,
    };

    await S3.putObject(params).promise();

    return `${process.env.ACHEEV_BUCKET_LINK}/${filePath}`;
  } catch (err) {
    throw err;
  }
};
