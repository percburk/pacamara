import s3Router from 'react-dropzone-s3-uploader/s3router'

const router = s3Router({
  bucket: process.env.AWS_S3_BUCKET, // required
  region: process.env.AWS_S3_REGION, // optional
  headers: { 'Access-Control-Allow-Origin': '*' }, // optional
  ACL: 'public-read', // this is the default
})

export { router as s3Router }
