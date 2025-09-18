// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  },
  
  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'ChatBot App',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  
  // Feature flags
  features: {
    enableGoogleAuth: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  }
};

// Validation function
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_API_URL) {
    errors.push('NEXT_PUBLIC_API_URL is not set');
  }
  
  if (errors.length > 0) {
    console.warn('Configuration warnings:', errors);
  }
  
  return errors.length === 0;
};

// Initialize validation
if (typeof window !== 'undefined') {
  console.log('🔧 Environment config:', config);
  console.log('🌐 API Base URL:', config.api.baseUrl);
  console.log('⏱️ API Timeout:', config.api.timeout);
  validateConfig();
}
