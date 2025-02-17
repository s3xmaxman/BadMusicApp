import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { toast } from "react-hot-toast";
import { sanitizeTitle } from "@/libs/helpers";

interface UploadFileToR2Props {
  file: File;
  bucketName: "spotlight" | "song" | "image" | "video";
  fileType: "image" | "audio" | "video";
  fileNamePrefix?: string;
}

const uploadFileToR2 = async ({
  file,
  bucketName,
  fileType,
  fileNamePrefix,
}: UploadFileToR2Props) => {
  const maxSize = 50 * 1024 * 1024; // 50MB

  if (file.size > maxSize) {
    toast.error("ファイルのサイズが50MBを超えています");
  }

  const fileName = `${fileNamePrefix}-${sanitizeTitle(
    file.name
  )}-${Date.now()}`;

  const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CF_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
    },
  });

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3Client.send(command);

    const url = `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com/spotlight/${fileName}`;
    return url;
  } catch (error) {
    console.error("R2 upload error:", error);
    toast.error(
      `${
        fileType === "video"
          ? "動画"
          : fileType === "audio"
          ? "オーディオ"
          : "画像"
      }のアップロードに失敗しました`
    );
    return null;
  }
};

export default uploadFileToR2;
