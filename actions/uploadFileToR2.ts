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
    return null;
  }

  const fileName = `${fileNamePrefix}-${sanitizeTitle(
    file.name
  )}-${Date.now()}`;

  const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY!,
      secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_KEY!,
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

    const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
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
