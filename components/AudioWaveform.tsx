import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface AudioWaveformProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onEnded: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  imageUrl?: string;
}

const AudioWaveform = ({
  audioUrl,
  isPlaying,
  onPlayPause,
  onEnded,
  primaryColor = "#00ff87",
  secondaryColor = "#60efff",
  imageUrl = "/images/wait.jpg",
}: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isEnded, setIsEnded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 512;

    audioRef.current = new Audio(audioUrl);
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.volume = 0.1;

    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current?.duration || 0);
    });

    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioRef.current?.currentTime || 0);
    });

    audioRef.current.addEventListener("ended", () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsEnded(true);
        onEnded();
      }, 500);
    });

    sourceRef.current = audioContextRef.current.createMediaElementSource(
      audioRef.current
    );
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl, onEnded]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      setIsEnded(false);
      setIsTransitioning(false);
      audioRef.current.play();
      draw();
    } else {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isPlaying]);

  // Reset audio position when ended
  useEffect(() => {
    if (isEnded && audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [isEnded]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景グラデーション
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    bgGradient.addColorStop(0, "rgba(0, 0, 0, 0.8)");
    bgGradient.addColorStop(1, "rgba(0, 0, 0, 0.6)");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const barWidth = (canvas.width / bufferLength) * 2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * (canvas.height / 2);

      // インタラクティブな高さの調整
      const distanceFromMouse = Math.abs(x - mousePosition.x);
      const heightMultiplier = Math.max(
        1,
        1.5 - distanceFromMouse / (canvas.width / 4)
      );
      const adjustedHeight = barHeight * heightMultiplier;

      // メインのグラデーション
      const gradient = ctx.createLinearGradient(
        x,
        centerY - adjustedHeight,
        x,
        centerY + adjustedHeight
      );
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(1, secondaryColor);

      // 上部の波形
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.moveTo(x, centerY - adjustedHeight);
      ctx.lineTo(x + barWidth, centerY - adjustedHeight);
      ctx.lineTo(x + barWidth, centerY);
      ctx.lineTo(x, centerY);
      ctx.closePath();
      ctx.fill();

      // 下部の波形（ミラー効果）
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.moveTo(x, centerY);
      ctx.lineTo(x + barWidth, centerY);
      ctx.lineTo(x + barWidth, centerY + adjustedHeight);
      ctx.lineTo(x, centerY + adjustedHeight);
      ctx.closePath();
      ctx.fill();

      // グロー効果
      ctx.shadowBlur = 10;
      ctx.shadowColor = primaryColor;

      x += barWidth + 1;
    }

    // プログレスライン
    const progress = currentTime / duration;
    ctx.beginPath();
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.moveTo(0, canvas.height - 5);
    ctx.lineTo(canvas.width * progress, canvas.height - 5);
    ctx.stroke();

    animationRef.current = requestAnimationFrame(draw);
  };

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm overflow-hidden">
      <AnimatePresence mode="wait">
        {isEnded ? (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative h-full w-full"
          >
            <Image
              fill
              src={imageUrl}
              alt="Cover"
              className="object-cover opacity-40"
            />
          </motion.div>
        ) : (
          <motion.div
            key="waveform"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative h-full"
          >
            <canvas
              ref={canvasRef}
              width={1000}
              height={200}
              className={`w-full h-full cursor-pointer transition-all duration-500 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
              onClick={onPlayPause}
              onMouseMove={handleMouseMove}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioWaveform;