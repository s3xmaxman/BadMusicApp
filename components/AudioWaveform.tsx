import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import useAudioWaveStore from "@/hooks/audio/useAudioWave";

interface AudioWaveformProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onEnded: () => void;
  primaryColor: string;
  secondaryColor: string;
  imageUrl: string;
  songId: string;
}

const AudioWaveform = ({
  primaryColor = "#00ff87",
  secondaryColor = "#60efff",
  imageUrl,
  audioUrl,
  songId,
}: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);

  const {
    analyser,
    currentTime,
    duration,
    isPlaying,
    isEnded,
    play,
    pause,
    initializeAudio,
    cleanup,
    setIsEnded,
  } = useAudioWaveStore();

  useEffect(() => {
    if (isPlaying) {
      setHasPlaybackStarted(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isEnded) {
      setHasPlaybackStarted(false);
    }
  }, [isEnded]);

  useEffect(() => {
    initializeAudio(audioUrl, songId);
    return () => {
      cleanup();
    };
  }, [songId, initializeAudio, audioUrl, cleanup]);

  useEffect(() => {
    if (isPlaying) {
      setIsTransitioning(false);
      draw();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isPlaying]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleExitComplete = async () => {
    if (isEnded) {
      cleanup();
      await initializeAudio(audioUrl, songId);

      setIsEnded(false);
      setHasPlaybackStarted(false);
    }
  };

  const draw = () => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

      const distanceFromMouse = Math.abs(x - mousePosition.x);
      const heightMultiplier = Math.max(
        1,
        1.5 - distanceFromMouse / (canvas.width / 4)
      );
      const adjustedHeight = barHeight * heightMultiplier;

      const gradient = ctx.createLinearGradient(
        x,
        centerY - adjustedHeight,
        x,
        centerY + adjustedHeight
      );
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(1, secondaryColor);

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.moveTo(x, centerY - adjustedHeight);
      ctx.lineTo(x + barWidth, centerY - adjustedHeight);
      ctx.lineTo(x + barWidth, centerY);
      ctx.lineTo(x, centerY);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.moveTo(x, centerY);
      ctx.lineTo(x + barWidth, centerY);
      ctx.lineTo(x + barWidth, centerY + adjustedHeight);
      ctx.lineTo(x, centerY + adjustedHeight);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 10;
      ctx.shadowColor = primaryColor;

      x += barWidth + 1;
    }

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
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {isEnded && !hasPlaybackStarted ? (
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
              onClick={isPlaying ? pause : play}
              onMouseMove={handleMouseMove}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioWaveform;
