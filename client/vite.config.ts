import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For detailed documentation on Vite server options: https://vite.dev/config/server-options.html
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // This re-routing check prints proxy metrics out to your frontend terminal window
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Vite Proxy Error Intercept:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Forwarding Outbound Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Backend Response:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
});