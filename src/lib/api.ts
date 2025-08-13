export const API_URL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function apiUrl(path: string): string {
  if (!path.startsWith("/")) return `${API_URL}/${path}`;
  return `${API_URL}${path}`;
}

