import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

describe("R2 Connection Test", () => {
  it("should connect to R2 and list buckets", async () => {
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_KEY!,
      },
    });

    try {
      const response = await s3Client.send(new ListBucketsCommand({}));

      expect(response.Buckets).toBeDefined();

      console.log(response.Buckets);
    } catch (error) {
      fail(error);
    }
  });
});
