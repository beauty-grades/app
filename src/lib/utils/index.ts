import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { getRelativeTimeString } from "./get-relative-time-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { getRelativeTimeString };
