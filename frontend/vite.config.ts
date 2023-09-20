import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version) // Define an APP_VERSION variable equal to the version of the app as defined by package.json
  }
});
