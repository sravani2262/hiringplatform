export const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? '/api' // This will be the same origin in production
    : 'http://localhost:8080/api', // Development URL
};