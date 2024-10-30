// libs/SunoApi.ts
import axios, { AxiosInstance } from "axios";
import UserAgent from "user-agents";
import pino from "pino";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { sleep } from "./utils";
import { get } from "http";

const logger = pino();
export const DEFAULT_MODEL = "chirp-v3-5";

export interface AudioInfo {
  id: string; // 音声の一意の識別子
  title?: string; // 音声のタイトル
  image_url?: string; // 音声に関連付けられた画像のURL
  lyric?: string; // 音声の歌詞
  audio_url?: string; // 音声ファイルのURL
  video_url?: string; // 音声に関連付けられたビデオのURL
  created_at: string; // 音声が作成された日時
  model_name: string; // 音声生成に使用されたモデルの名前
  gpt_description_prompt?: string; // GPT説明のプロンプト
  prompt?: string; // 音声生成のプロンプト
  status: string; // ステータス
  type?: string;
  tags?: string; // 音楽のジャンル
  negative_tags?: string; // 音楽のネガティブタグ
  duration?: string; // 音声の長さ
  error_message?: string; // エラーメッセージ（もしあれば）
}

class SunoApi {
  private static BASE_URL: string = "https://studio-api.suno.ai";
  private static CLERK_BASE_URL: string = "https://clerk.suno.com";
  private static JSDELIVR_BASE_URL: string = "https://data.jsdelivr.com";

  private readonly client: AxiosInstance;
  private clerkVersion?: string;
  private sid?: string;
  private currentToken?: string;

  constructor(cookie: string) {
    const cookieJar = new CookieJar();
    const randomUserAgent = new UserAgent(/Chrome/).random().toString();
    this.client = wrapper(
      axios.create({
        jar: cookieJar,
        withCredentials: true,
        headers: {
          "User-Agent": randomUserAgent,
          Cookie: cookie,
        },
      })
    );
    this.client.interceptors.request.use((config) => {
      if (this.currentToken) {
        // 現在のトークン状態を使用する
        config.headers["Authorization"] = `Bearer ${this.currentToken}`;
      }
      return config;
    });
  }

  public async init(): Promise<SunoApi> {
    await this.getClerkLatestVersion();
    await this.getAuthToken();
    await this.keepAlive();
    return this;
  }

  /**
   * clerkパッケージの最新バージョンIDを取得する。
   */
  private async getClerkLatestVersion() {
    // clerkバージョンIDを取得するためのURL
    const getClerkVersionUrl = `${SunoApi.JSDELIVR_BASE_URL}/v1/package/npm/@clerk/clerk-js`;
    // clerkバージョンIDを取得する
    const versionListResponse = await this.client.get(getClerkVersionUrl);
    if (!versionListResponse?.data?.["tags"]["latest"]) {
      throw new Error(
        "clerkバージョン情報の取得に失敗しました。後ほど再試行してください。"
      );
    }
    // 認証のためにclerkバージョンIDを保存する
    this.clerkVersion = versionListResponse?.data?.["tags"]["latest"];
  }

  /**
   * セッションIDを取得し、後で使用するために保存する。
   */
  private async getAuthToken() {
    // セッションIDを取得するためのURL
    const getSessionUrl = `${SunoApi.CLERK_BASE_URL}/v1/client?_clerk_js_version=${this.clerkVersion}`;
    // セッションIDを取得する
    const sessionResponse = await this.client.get(getSessionUrl);
    if (!sessionResponse?.data?.response?.["last_active_session_id"]) {
      throw new Error(
        "セッションIDの取得に失敗しました。SUNO_COOKIEを更新する必要があるかもしれません。"
      );
    }
    // 後で使用するためにセッションIDを保存する
    this.sid = sessionResponse.data.response["last_active_session_id"];
  }

  /**
   * セッションを維持する。
   * @param isWait セッションが完全に更新されるまでメソッドが戻るのを待つ必要があるかどうかを示します。
   */
  public async keepAlive(isWait?: boolean): Promise<void> {
    if (!this.sid) {
      throw new Error(
        "セッションIDが設定されていません。トークンを更新できません。"
      );
    }
    // セッショントークンを更新するためのURL
    const renewUrl = `${SunoApi.CLERK_BASE_URL}/v1/client/sessions/${this.sid}/tokens?_clerk_js_version==${this.clerkVersion}`;
    // セッショントークンを更新する
    const renewResponse = await this.client.post(renewUrl);
    logger.info("KeepAlive...\n");
    if (isWait) {
      await sleep(1, 2);
    }
    const newToken = renewResponse.data["jwt"];
    // リクエストヘッダーのAuthorizationフィールドを新しいJWTトークンで更新する
    this.currentToken = newToken;
  }

  /**
   * プロンプトに基づいて曲を生成する。
   * @param prompt 音声を生成するためのテキストプロンプト。
   * @param make_instrumental 生成される音声がインストラメンタルである必要があるかどうかを示します。
   * @param wait_audio 音声ファイルが完全に生成されるまでメソッドが戻るのを待つ必要があるかどうかを示します。
   * @returns
   */
  public async generate(
    prompt: string,
    make_instrumental: boolean = false,
    model?: string,
    wait_audio: boolean = false
  ): Promise<AudioInfo[]> {
    await this.keepAlive(false);
    const startTime = Date.now();
    const audios = this.generateSongs(
      prompt,
      false,
      undefined,
      undefined,
      make_instrumental,
      model,
      wait_audio
    );
    const costTime = Date.now() - startTime;
    logger.info("Generate Response:\n" + JSON.stringify(audios, null, 2));
    logger.info("Cost time: " + costTime);
    return audios;
  }

  /**
   * クリップを連結して曲全体を生成するために、concatenateエンドポイントを呼び出す。
   * @param clip_id 連結する音声クリップのID。
   * @returns 連結された音声を表すAudioInfoオブジェクトに解決されるPromise。
   * @throws レスポンスステータスが200でない場合、エラーをスローします。
   */
  public async concatenate(clip_id: string): Promise<AudioInfo> {
    await this.keepAlive(false);
    const payload: any = { clip_id: clip_id };

    const response = await this.client.post(
      `${SunoApi.BASE_URL}/api/generate/concat/v2/`,
      payload,
      {
        timeout: 10000, // 10秒タイムアウト
      }
    );
    if (response.status !== 200) {
      throw new Error("エラーレスポンス：" + response.statusText);
    }
    return response.data;
  }

  /**
   * 指定されたパラメータに基づいてカスタム音声を生成する。
   *
   * @param prompt 音声を生成するためのテキストプロンプト。
   * @param tags 生成された音声を分類するためのタグ。
   * @param title 生成された音声のタイトル。
   * @param make_instrumental 生成される音声がインストラメンタルである必要があるかどうかを示します。
   * @param wait_audio 音声ファイルが完全に生成されるまでメソッドが戻るのを待つ必要があるかどうかを示します。
   * @param negative_tags 生成された音声に含めないネガティブタグ。
   * @returns 生成された音声を表すAudioInfoオブジェクトの配列に解決されるPromise。
   */
  public async custom_generate(
    prompt: string,
    tags: string,
    title: string,
    make_instrumental: boolean = false,
    model?: string,
    wait_audio: boolean = false,
    negative_tags?: string
  ): Promise<AudioInfo[]> {
    const startTime = Date.now();
    const audios = await this.generateSongs(
      prompt,
      true,
      tags,
      title,
      make_instrumental,
      model,
      wait_audio,
      negative_tags
    );
    const costTime = Date.now() - startTime;
    logger.info(
      "Custom Generate Response:\n" + JSON.stringify(audios, null, 2)
    );
    logger.info("Cost time: " + costTime);
    return audios;
  }

  /**
   * 指定されたパラメータに基づいて曲を生成する。
   *
   * @param prompt 曲を生成するためのテキストプロンプト。
   * @param isCustom タグやタイトルなどのカスタムパラメータを考慮する必要があるかどうかを示します。
   * @param tags isCustomがtrueの場合のみ使用される、曲を分類するためのオプションのタグ。
   * @param title isCustomがtrueの場合のみ使用される、曲のオプションのタイトル。
   * @param make_instrumental 生成される曲がインストラメンタルである必要があるかどうかを示します。
   * @param wait_audio 音声ファイルが完全に生成されるまでメソッドが戻るのを待つ必要があるかどうかを示します。
   * @param negative_tags 生成された音声に含めないネガティブタグ。
   * @returns 生成された曲を表すAudioInfoオブジェクトの配列に解決されるPromise。
   */
  private async generateSongs(
    prompt: string,
    isCustom: boolean,
    tags?: string,
    title?: string,
    make_instrumental?: boolean,
    model?: string,
    wait_audio: boolean = false,
    negative_tags?: string
  ): Promise<AudioInfo[]> {
    await this.keepAlive(false);
    const payload: any = {
      make_instrumental: make_instrumental == true,
      mv: model || DEFAULT_MODEL,
      prompt: "",
    };
    if (isCustom) {
      payload.tags = tags;
      payload.title = title;
      payload.negative_tags = negative_tags;
      payload.prompt = prompt;
    } else {
      payload.gpt_description_prompt = prompt;
    }
    logger.info(
      "generateSongs payload:\n" +
        JSON.stringify(
          {
            prompt: prompt,
            isCustom: isCustom,
            tags: tags,
            title: title,
            make_instrumental: make_instrumental,
            wait_audio: wait_audio,
            negative_tags: negative_tags,
            payload: payload,
          },
          null,
          2
        )
    );
    const response = await this.client.post(
      `${SunoApi.BASE_URL}/api/generate/v2/`,
      payload,
      {
        timeout: 10000, // 10秒タイムアウト
      }
    );
    logger.info(
      "generateSongs Response:\n" + JSON.stringify(response.data, null, 2)
    );
    if (response.status !== 200) {
      throw new Error("エラーレスポンス：" + response.statusText);
    }
    const songIds = response.data["clips"].map((audio: any) => audio.id);
    // 音楽ファイルの生成を待つ
    if (wait_audio) {
      const startTime = Date.now();
      let lastResponse: AudioInfo[] = [];
      await sleep(5, 5);
      while (Date.now() - startTime < 100000) {
        const response = await this.get(songIds);
        const allCompleted = response.every(
          (audio) => audio.status === "streaming" || audio.status === "complete"
        );
        const allError = response.every((audio) => audio.status === "error");
        if (allCompleted || allError) {
          return response;
        }
        lastResponse = response;
        await sleep(3, 6);
        await this.keepAlive(true);
      }
      return lastResponse;
    } else {
      await this.keepAlive(true);
      return response.data["clips"].map((audio: any) => ({
        id: audio.id,
        title: audio.title,
        image_url: audio.image_url,
        lyric: audio.metadata.prompt,
        audio_url: audio.audio_url,
        video_url: audio.video_url,
        created_at: audio.created_at,
        model_name: audio.model_name,
        status: audio.status,
        gpt_description_prompt: audio.metadata.gpt_description_prompt,
        prompt: audio.metadata.prompt,
        type: audio.metadata.type,
        tags: audio.metadata.tags,
        negative_tags: audio.metadata.negative_tags,
        duration: audio.metadata.duration,
      }));
    }
  }

  /**
   * 指定されたプロンプトに基づいて歌詞を生成する。
   * @param prompt 歌詞生成のためのプロンプト。
   * @returns 生成された歌詞テキスト。
   */
  public async generateLyrics(prompt: string): Promise<string> {
    await this.keepAlive(false);
    // 歌詞生成を開始する
    const generateResponse = await this.client.post(
      `${SunoApi.BASE_URL}/api/generate/lyrics/`,
      { prompt }
    );
    const generateId = generateResponse.data.id;

    // 歌詞の完成をポーリングする
    let lyricsResponse = await this.client.get(
      `${SunoApi.BASE_URL}/api/generate/lyrics/${generateId}`
    );
    while (lyricsResponse?.data?.status !== "complete") {
      await sleep(2); // 2秒待ってから再度ポーリングする
      lyricsResponse = await this.client.get(
        `${SunoApi.BASE_URL}/api/generate/lyrics/${generateId}`
      );
    }

    // 生成された歌詞テキストを返す
    return lyricsResponse.data;
  }

  /**
   * 指定されたプロンプトに基づいて追加コンテンツを生成することにより、既存の音声クリップを拡張する。
   *
   * @param audioId 拡張する音声クリップのID。
   * @param prompt 追加コンテンツを生成するためのプロンプト。
   * @param continueAt mm:ss（例：00:30）で曲から新しいクリップを拡張します。デフォルトでは曲の末尾から拡張します。
   * @param tags 音楽のスタイル。
   * @param title 曲のタイトル。
   * @returns 拡張された音声クリップを表すAudioInfoオブジェクトに解決されるPromise。
   */
  public async extendAudio(
    audioId: string,
    prompt: string = "",
    continueAt: string = "0",
    tags: string = "",
    title: string = "",
    model?: string
  ): Promise<AudioInfo> {
    const response = await this.client.post(
      `${SunoApi.BASE_URL}/api/generate/v2/`,
      {
        continue_clip_id: audioId,
        continue_at: continueAt,
        mv: model || DEFAULT_MODEL,
        prompt: prompt,
        tags: tags,
        title: title,
      }
    );
    console.log("response：\n", response);
    return response.data;
  }

  /**
   * 音声メタデータからの歌詞（プロンプト）をより読みやすい形式に処理する。
   * @param prompt 元の歌詞テキスト。
   * @returns 処理された歌詞テキスト。
   */
  private parseLyrics(prompt: string): string {
    // 元の歌詞が特定の区切り文字（例：改行）で区切られていると仮定すると、より読みやすい形式に変換できます。
    // ここでの実装は、実際の歌詞形式に合わせて調整できます。
    // たとえば、歌詞が連続したテキストとして存在する場合、特定のマーカー（ピリオド、コンマなど）に基づいて分割する必要がある場合があります。
    // 次の実装では、歌詞がすでに改行で区切られていると仮定しています。

    // 改行を使用して歌詞を分割し、空行を削除します。
    const lines = prompt.split("\n").filter((line) => line.trim() !== "");

    // 処理された歌詞行を、各行の間を改行で区切った単一の文字列に再構成します。
    // 特定のマーカーを追加したり、特別な行を処理したりするなど、追加のフォーマットロジックをここに追加できます。
    return lines.join("\n");
  }

  /**
   * 指定された曲IDの音声情報を取得する。
   * @param songIds 情報を取得する曲IDのオプションの配列。
   * @returns AudioInfoオブジェクトの配列に解決されるPromise。
   */
  public async get(songIds?: string[]): Promise<AudioInfo[]> {
    await this.keepAlive(false);
    let url = `${SunoApi.BASE_URL}/api/feed/`;
    if (songIds) {
      url = `${url}?ids=${songIds.join(",")}`;
    }
    logger.info("Get audio status: " + url);
    const response = await this.client.get(url, {
      // 3秒タイムアウト
      timeout: 3000,
    });

    const audios = response.data;
    return audios.map((audio: any) => ({
      id: audio.id,
      title: audio.title,
      image_url: audio.image_url,
      lyric: audio.metadata.prompt
        ? this.parseLyrics(audio.metadata.prompt)
        : "",
      audio_url: audio.audio_url,
      video_url: audio.video_url,
      created_at: audio.created_at,
      model_name: audio.model_name,
      status: audio.status,
      gpt_description_prompt: audio.metadata.gpt_description_prompt,
      prompt: audio.metadata.prompt,
      type: audio.metadata.type,
      tags: audio.metadata.tags,
      duration: audio.metadata.duration,
      error_message: audio.metadata.error_message,
    }));
  }

  /**
   * 特定の音声クリップの情報を取得する。
   * @param clipId 情報を取得する音声クリップのID。
   * @returns 音声クリップ情報を含むオブジェクトに解決されるPromise。
   */
  public async getClip(clipId: string): Promise<object> {
    await this.keepAlive(false);
    const response = await this.client.get(
      `${SunoApi.BASE_URL}/api/clip/${clipId}`
    );
    return response.data;
  }

  public async get_credits(): Promise<object> {
    await this.keepAlive(false);
    const response = await this.client.get(
      `${SunoApi.BASE_URL}/api/billing/info/`
    );
    return {
      credits_left: response.data.total_credits_left,
      period: response.data.period,
      monthly_limit: response.data.monthly_limit,
      monthly_usage: response.data.monthly_usage,
    };
  }
}

const newSunoApi = async (cookie: string) => {
  const sunoApi = new SunoApi(cookie);
  return await sunoApi.init();
};

if (!process.env.SUNO_COOKIE) {
  console.log("Environment does not contain SUNO_COOKIE.", process.env);
}

export const sunoApi = newSunoApi(process.env.SUNO_COOKIE || "");
