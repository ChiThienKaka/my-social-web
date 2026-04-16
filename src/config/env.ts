export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  appName: import.meta.env.VITE_APP_NAME || 'TalentHub',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
};
