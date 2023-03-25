import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFirstAndLastName(name: string) {
  const name_parts = name.split(" ")
  if (name_parts.length === 1) {
    return [name, ""]
  }
  if (name_parts.length === 2) {
    return [name_parts[0], name_parts[1]]
  }
  if (name_parts.length === 3) {
    return [name_parts[0], name_parts[2]]
  }
  return [name_parts.slice(0, -2).join(" "), name_parts.slice(-2).join(" ")]
}
