import DropzoneS3Uploader from 'react-dropzone-s3-uploader';

// Photo uploader that handles the drag-and-drop to upload a user supplied
// photo to AWS S3
function S3Uploader({ setPhoto }) {
  const handleFinishedUpload = (info) => {
    console.log('Access it on s3 at', info.fileUrl);
    setPhoto(info.fileUrl);
  };

  const s3Url = 'https://burkbucket.s3.amazonaws.com';
  return (
    <DropzoneS3Uploader
      onFinish={handleFinishedUpload}
      s3Url={s3Url}
      maxSize={1024 * 1024 * 5}
      upload={{}}
    />
  );
}

export default S3Uploader;
