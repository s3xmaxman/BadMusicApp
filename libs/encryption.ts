import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

export class Encryption {
  private static readonly algorithm = "aes-256-ctr";
  private static readonly key = process.env.ENCRYPTION_KEY;

  static encrypt(text: string): string {
    if (!this.key) {
      throw new Error("Encryption key is not set");
    }

    const iv = randomBytes(16);
    const salt = randomBytes(16);
    const key = scryptSync(this.key, salt, 32);
    const cipher = createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    // saltとivも暗号文と一緒に保存
    return salt.toString("hex") + ":" + iv.toString("hex") + ":" + encrypted;
  }

  static decrypt(encryptedText: string): string {
    if (!this.key) {
      throw new Error("Encryption key is not set");
    }

    const [saltHex, ivHex, encrypted] = encryptedText.split(":");
    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const key = scryptSync(this.key, salt, 32);
    const decipher = createDecipheriv(this.algorithm, key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
