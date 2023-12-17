// import React from 'react';

interface SeekbarProps {
  min?: number;
  max: number;
  value: number;
  onChange: (newValue: number) => void;
}


const Seekbar: React.FC<SeekbarProps> = ({
    min = 0,
    max,
    value,
    onChange,
  }) => {
    // バックグラウンドのスタイルを計算
    const percentage = `${((value - min) * 100) / (max - min)}%`;
  
    // Tailwind CSS のユーティリティクラスでスタイルを指定しています
    return (
        <div className="relative w-full">
          <div
            className="h-2 bg-gray-200 rounded-full overflow-hidden"
            style={{
              background: `linear-gradient(to right, green ${percentage}, gray ${percentage})`
            }}
          >
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(e) => onChange(+e.target.value)}
              className="w-full h-full cursor-pointer appearance-none bg-transparent rounded-full outline-none opacity-0"
            />
          </div>
        </div>
      );
  };
  
export default Seekbar;
  

  



