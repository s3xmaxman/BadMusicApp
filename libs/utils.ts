import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import pino from "pino";

const logger = pino();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 指定された時間だけスリープします。
 *
 * 引数が1つの場合、`sleep`はその時間だけスリープします。
 * 引数が2つの場合、`sleep`は2つの引数の間のランダムな時間だけスリープします。
 *
 * @param {number} x - スリープする最小時間
 * @param {number} [y] - スリープする最大時間
 * @returns {Promise<void>} - スリープが完了したときに解決されるPromise
 */
export const sleep = (x: number, y?: number): Promise<void> => {
  let timeout = x * 1000;

  if (y !== undefined && y !== x) {
    const min = Math.min(x, y);
    const max = Math.max(x, y);
    timeout = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
  }

  logger.info(`Sleeping for ${timeout / 1000}ms`);

  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const getRandomColor = () => {
  const colors = [
    "#00ff87",
    "#60efff",
    "#0061ff",
    "#ff00a0",
    "#ff1700",
    "#fff700",
    "#a6ff00",
    "#00ffa3",
    "#00ffff",
    "#ff00ff",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const splitTags = (tagString?: string): string[] => {
  return tagString?.split(/\s*,\s*/).filter(Boolean) || [];
};
