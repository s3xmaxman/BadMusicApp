import React, { useState, useEffect, useRef } from "react";

interface ScrollingTextProps {
  text: string;
  duration?: number;
}

const LIMIT_CHARACTERS = 15;

const ScrollingText: React.FC<ScrollingTextProps> = ({
  text,
  duration = 10,
}) => {
  const [textWidth, setTextWidth] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // テキストの幅を計算
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth);
    }
  }, [text]);

  // アニメーションの速度を計算（テキストの長さに応じて調整）
  const animationDuration =
    textWidth > 0 ? Math.max(duration, textWidth / 100) : duration;

  if (text.length < LIMIT_CHARACTERS) {
    return <span>{text}</span>;
  }

  return (
    <div className="scrolling-text-container">
      <span
        ref={textRef}
        className="scrolling-text"
        style={{ animationDuration: `${animationDuration}s` }}
      >
        {text}
      </span>
    </div>
  );
};

export default ScrollingText;
