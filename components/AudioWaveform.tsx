"use client";
import React, { useEffect, useRef, useState } from "react";

interface AudioWaveformProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const AudioWaveform = ({
  audioUrl,
  isPlaying,
  onPlayPause,
}: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;

    audioRef.current = new Audio(audioUrl);
    audioRef.current.crossOrigin = "anonymous";

    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current?.duration || 0);
    });

    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioRef.current?.currentTime || 0);
    });

    audioRef.current.addEventListener("ended", () => {
      onPlayPause();
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
  }, [audioUrl]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
      draw();
    } else {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isPlaying]);

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(
        0,
        `hsla(${(i / bufferLength) * 240 + 240}, 100%, 50%, 0.8)`
      );
      gradient.addColorStop(
        1,
        `hsla(${(i / bufferLength) * 240}, 100%, 50%, 0.8)`
      );

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
      ctx.fillRect(x, 0, barWidth, barHeight / 2);

      x += barWidth + 1;
    }

    animationRef.current = requestAnimationFrame(draw);
  };

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm">
      <div className="relative h-full">
        <canvas
          ref={canvasRef}
          width={1000}
          height={200}
          className="w-full h-full cursor-pointer"
          onClick={onPlayPause}
        />
      </div>
    </div>
  );
};

export default AudioWaveform;
