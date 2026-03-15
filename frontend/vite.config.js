import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const allowedHosts = [
    'train-graph.cluster-0.preview.emergentcf.cloud',
    '.preview.emergentcf.cloud',
    '.preview.emergentagent.com',
    'localhost',
    '127.0.0.1',
  ];

  return {
    plugins: [react(), tailwindcss()],
    server: {
      allowedHosts,
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8001',
          changeOrigin: true,
          ws: true,
        },
      },
    },
    preview: {
      allowedHosts,
      host: '0.0.0.0',
      port: 3000,
    },
    define: {
      'process.env.REACT_APP_BACKEND_URL': JSON.stringify(env.REACT_APP_BACKEND_URL),
    },
  };
});
