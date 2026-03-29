export const APP_URL = "https://hooked-on-kawaii.vercel.app";

export const AUTH_REDIRECTS = {
  signup: APP_URL,
  resetPassword: `${APP_URL}/reset-password`,
} as const;
