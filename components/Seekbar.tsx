// import { ChangeEvent } from 'react';

// interface SeekBarProps {
//   currentTime: number;
//   duration: number;
//   onSeek: (time: number) => void;
// }

// const SeekBar: React.FC<SeekBarProps> = ({ currentTime, duration, onSeek }) => {
//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const percentage = parseFloat(event.target.value);
//     const newTime = (percentage / 100) * duration;
//     onSeek(newTime);
//   };

//   const normalizedValue = (currentTime / duration) * 100;

//   return (
//     <input
//       type="range"
//       min={0}
//       max={100}
//       value={normalizedValue}
//       onChange={handleChange}
//     />
//   );
// };

// export default SeekBar;

import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

// スライダー（シークバー）のスタイルを定義
const StyledSlider = styled.input`
  -webkit-appearance: none; // ブラウザーデフォルトスタイルを除去
  width: 30%; // フル幅にする
  height: 4px; // 高さを適切なサイズに設定
  border-radius: 1px; // 角を丸くする
  background: #ddd; // 背景色を設定
  outline: none; // アウトラインを除去
  opacity: 0.7; // 透過度を下げて、柔らかい見た目にする
  -webkit-transition: .2s; // スムーズな遷移のための設定
  transition: opacity .2s;

  // スライダーサム（つまみ）のスタイルを定義
  &::-webkit-slider-thumb {
    -webkit-appearance: none; // ブラウザーデフォルトスタイルを除去
    appearance: none;
    width: 15px; // サムの幅を設定
    height: 15px; // サムの高さを設定
    border-radius: 50%; // サムを円形にする
    background: #4CAF50; // サムの背景色
    cursor: pointer; // カーソルをポインターにする
  }

  // フォーカス時のスライダーサムのスタイルを変える
  &:focus::-webkit-slider-thumb {
    background: #3e8e41;
  }

  // ホバー時のスライダーサムのスタイルを変える
  &:hover {
    opacity: 1; // ホバー時は不透明に
  }
`;

const SeekBar: React.FC<SeekBarProps> = ({ currentTime, duration, onSeek }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const percentage = parseFloat(event.target.value);
    const newTime = (percentage / 100) * duration;
    onSeek(newTime);
  };

  const normalizedValue = (currentTime / duration) * 100;

  return (
    <StyledSlider
      type="range"
      min="0"
      max="100"
      value={normalizedValue.toString()}
      onChange={handleChange}
    />
  );
};

export default SeekBar;










  



