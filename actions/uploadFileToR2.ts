import { PutObjectCommand } from "@aws-sdk/client-s3";
import { toast } from "react-hot-toast";
import { sanitizeTitle } from "@/libs/helpers";
import s3Client from "@/libs/s3";

interface UploadFileToR2Props {
  file: File;
  bucketName: "spotlight" | "song" | "image" | "video";
  fileType: "image" | "audio" | "video";
  fileNamePrefix?: string;
}

/**
 * R2にファイルをアップロードし、アップロードされたファイルのURLを返します。
 * @param {File} file - アップロードするファイル
 * @param {'spotlight' | 'song' | 'image' | 'video'} bucketName - アップロード先のバケット名
 * @param {'image' | 'audio' | 'video'} fileType - ファイルのタイプ
 * @param {string} [fileNamePrefix] - ファイル名のプレフィックス（オプション）
 * @returns {Promise<string | null>} - アップロードされたファイルのURL、またはエラー時はnull
 * @throws {Error} - アップロード中にエラーが発生した場合
 */
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

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3Client.send(command);

    switch (bucketName) {
      case "spotlight":
        return `${process.env.NEXT_PUBLIC_R2_SPOTLIGHT_URL}/${fileName}`;
      case "song":
        return `${process.env.NEXT_PUBLIC_R2_SONG_URL}/${fileName}`;
      case "image":
        return `${process.env.NEXT_PUBLIC_R2_IMAGE_URL}/${fileName}`;
      case "video":
        return `${process.env.NEXT_PUBLIC_R2_VIDEO_URL}/${fileName}`;
    }
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
