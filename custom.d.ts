declare module 'react-dropzone-s3-uploader/s3router';

declare namespace Express {
  interface User {
    id: number;
    username: string;
    profile_pic?: string;
    methods_default_id?: number;
    kettle?: string;
    grinder?: string;
    tds_min?: number;
    tds_max?: number;
    ext_min?: number;
    ext_max?: number;
    name?: string;
    methods_default_lrr?: number;
  }
}
