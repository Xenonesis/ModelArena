import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatResponseTime(responseTime: number): string {
  if (responseTime < 1000) {
    return `${responseTime}ms`
  } else if (responseTime < 60000) {
    return `${(responseTime / 1000).toFixed(1)}s`
  } else {
    const minutes = Math.floor(responseTime / 60000)
    const seconds = Math.floor((responseTime % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }
}
