import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

/**
 * テキストの暗号化と復号化を行うユーティリティクラス
 * AES-256-CTRアルゴリズムを使用
 */
export class Encryption {
  private static readonly algorithm = "aes-256-ctr";
  private static readonly key = process.env.ENCRYPTION_KEY;

  /**
   * テキストを暗号化する
   * @param text 暗号化する文字列
   * @returns 暗号化された文字列（形式: salt:iv:encrypted）
   * @throws 暗号化キーが設定されていない場合にエラー
   */
  static encrypt(text: string): string {
    if (!this.key) {
      throw new Error("Encryption key is not set");
    }

    // ランダムな初期化ベクトル(IV)とソルトを生成
    const iv = randomBytes(16);
    const salt = randomBytes(16);
    
    // ソルトを使用して暗号化キーを生成
    const key = scryptSync(this.key, salt, 32);
    
    // 暗号化処理の実行
    const cipher = createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    // salt:iv:encrypted の形式で結果を返す
    return salt.toString("hex") + ":" + iv.toString("hex") + ":" + encrypted;
  }

  /**
   * 暗号化されたテキストを復号化する
   * @param encryptedText 暗号化された文字列（形式: salt:iv:encrypted）
   * @returns 復号化された文字列
   * @throws 暗号化キーが設定されていない場合にエラー
   */
  static decrypt(encryptedText: string): string {
    if (!this.key) {
      throw new Error("Encryption key is not set");
    }

    // 暗号文字列を分解
    const [saltHex, ivHex, encrypted] = encryptedText.split(":");
    
    // バイナリデータに変換
    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    
    // 暗号化と同じキーを生成
    const key = scryptSync(this.key, salt, 32);
    
    // 復号化処理の実行
    const decipher = createDecipheriv(this.algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
