// testInsert.js
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config();

// 環境変数または直接キーを設定
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_KEY";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("環境変数が設定されていません。");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const insertMockData = async () => {
  const mockSong = {
    song_id: "test_id",
    user_id: "7fc3df17-fc3d-47fb-b98a-4679c08c1a44",
    title: "テスト曲",
    image_url: "https://example.com/image.jpg",
    lyric: "これはテスト用の歌詞です。",
    audio_url: "https://example.com/audio.mp3",
    video_url: "https://example.com/video.mp4",
    created_at: new Date().toISOString(),
    model_name: "test_model",
    status: "pending",
    gpt_description_prompt: "これはテスト用のプロンプトです。",
    prompt: "テストプロンプト",
    type: "test",
    tags: "test, mock",
  };

  const { data, error } = await supabase.from("suno_songs").insert(mockSong);

  if (error) {
    console.error("挿入エラー:", error);
  } else {
    console.log("挿入成功:", data);
  }
};

insertMockData();
