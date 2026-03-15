import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatMoney(val) {
  if (val === undefined || val === null || val === "") return "";
  const num = val.toString().replace(/[^0-9.]/g, "");
  if (!num) return "";
  const parts = num.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function parseMoney(val) {
  if (val === undefined || val === null || val === "") return "";
  return val.toString().replace(/,/g, "");
}
