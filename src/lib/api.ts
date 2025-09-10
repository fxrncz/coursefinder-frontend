export const API_URL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function apiUrl(path: string): string {
  // Remove trailing slash from API_URL and leading slash from path
  const baseUrl = API_URL.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${baseUrl}/${cleanPath}`;
}

