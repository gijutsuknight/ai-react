/**
 * Base URL for the backend API, including optional Spring Boot context path.
 * Set REACT_APP_API_BASE_URL (e.g. http://localhost:8080) and
 * REACT_APP_API_CONTEXT_PATH (e.g. /myapp) when your server uses a context path.
 */
export function getApiBaseUrl(): string {
  const base = (process.env.REACT_APP_API_BASE_URL ?? '').replace(/\/$/, '');
  const context = (process.env.REACT_APP_API_CONTEXT_PATH ?? '').trim();
  const contextPath = context ? (context.startsWith('/') ? context : `/${context}`) : '';
  return contextPath ? `${base}${contextPath}` : base;
}

export const UPLOAD_FILE_PATH = '/api/upload/file';
