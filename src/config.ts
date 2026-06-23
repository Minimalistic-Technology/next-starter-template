// Automatically switch between local development and production URLs without .env
const isDev = process.env.NODE_ENV === "development";
export const BASE_URL = isDev ? "http://localhost:8000" : "https://uat-dd.onrender.com";
export const TURNSTILE_SITE_KEY = "0x4AAAAAADpq1ln_6fIi8lP6";
