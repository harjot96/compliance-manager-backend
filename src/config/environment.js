// Environment configuration for frontend URLs
const getFrontendUrl = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return 'https://compliance-manager-frontend.onrender.com';
    case 'development':
    default:
      return 'http://localhost:3001';
  }
};

const getFrontendCallbackUrl = () => {
  const baseUrl = getFrontendUrl();
  return `${baseUrl}/xero-callback`;
};

const getFrontendRedirectUrl = () => {
  const baseUrl = getFrontendUrl();
  return `${baseUrl}/redirecturl`;
};

module.exports = {
  getFrontendUrl,
  getFrontendCallbackUrl,
  getFrontendRedirectUrl,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
};
