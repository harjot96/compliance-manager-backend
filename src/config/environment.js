// Environment configuration for frontend URLs
const getFrontendUrl = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      // Ensure production URL is used and doesn't contain localhost
      const productionUrl = process.env.FRONTEND_URL || 'https://compliance-manager-frontend.onrender.com';
      if (productionUrl.includes('localhost')) {
        console.warn('⚠️ WARNING: Production URL contains localhost. Using fallback production URL.');
        return 'https://compliance-manager-frontend.onrender.com';
      }
      return productionUrl;
    case 'development':
    default:
      return 'https://compliance-manager-frontend.onrender.com';
  }
};

const getFrontendCallbackUrl = () => {
  const baseUrl = getFrontendUrl();
  // Ensure callback URL doesn't contain localhost in production
  if (process.env.NODE_ENV === 'production' && baseUrl.includes('localhost')) {
    console.error('❌ ERROR: Production callback URL contains localhost. This is not allowed.');
    throw new Error('Production callback URL cannot contain localhost');
  }
  return `${baseUrl}/redirecturl`;
};

const getFrontendRedirectUrl = () => {
  const baseUrl = getFrontendUrl();
  // Ensure redirect URL doesn't contain localhost in production
  if (process.env.NODE_ENV === 'production' && baseUrl.includes('localhost')) {
    console.error('❌ ERROR: Production redirect URL contains localhost. This is not allowed.');
    throw new Error('Production redirect URL cannot contain localhost');
  }
  return `${baseUrl}/redirecturl`;
};

// Validation function to ensure URLs are production-ready
const validateProductionUrls = () => {
  if (process.env.NODE_ENV === 'production') {
    const frontendUrl = getFrontendUrl();
    const callbackUrl = getFrontendCallbackUrl();
    const redirectUrl = getFrontendRedirectUrl();
    
    if (frontendUrl.includes('localhost') || callbackUrl.includes('localhost') || redirectUrl.includes('localhost')) {
      throw new Error('Production URLs cannot contain localhost. Please check your environment configuration.');
    }
    
    console.log('✅ Production URLs validated successfully:');
    console.log(`   Frontend URL: ${frontendUrl}`);
    console.log(`   Callback URL: ${callbackUrl}`);
    console.log(`   Redirect URL: ${redirectUrl}`);
  }
};

module.exports = {
  getFrontendUrl,
  getFrontendCallbackUrl,
  getFrontendRedirectUrl,
  validateProductionUrls,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
};
