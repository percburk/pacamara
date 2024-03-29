import DropzoneS3Uploader from 'react-dropzone-s3-uploader'

// Photo uploader that handles the drag-and-drop to upload a user supplied
// photo to AWS S3
export default function S3Uploader({ setPhoto }: { setPhoto: (url: string) => void }) {
  const handleFinishedUpload = (info: { fileUrl: string }) => {
    // eslint-disable-next-line no-console
    console.log('Access it on s3 at', info.fileUrl)
    setPhoto(info.fileUrl)
  }

  const s3Url = import.meta.env.VITE_S3_URL
  return (
    <DropzoneS3Uploader
      onFinish={handleFinishedUpload}
      s3Url={s3Url}
      maxSize={1024 * 1024 * 5}
      upload={{}}
    />
  )
}
