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

  console.log("R2_ACCOUNT_ID:", process.env.R2_ACCOUNT_ID);
  console.log("R2_ACCESS_KEY:", process.env.R2_ACCESS_KEY);
  console.log("R2_SECRET_KEY:", process.env.R2_SECRET_KEY);

  const s3Client = new S3Client({
    region: "auto",
    endpoint:
      "https://42995ddbe3fdf60d4dd3fa0f60343689.r2.cloudflarestorage.com",
    credentials: {
      accessKeyId: "c7ce7d50c59d423511191a0ff1d3065e",
      secretAccessKey:
        "53f52c2218609145eb0b3c20dd178981c3ccec6d062d33e6fc4de20c6846fb58",
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

    const url = `https://42995ddbe3fdf60d4dd3fa0f60343689.r2.cloudflarestorage.com/${bucketName}/${fileName}`;
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
