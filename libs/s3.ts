import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_KEY!,
  },
});

export default s3Client;
