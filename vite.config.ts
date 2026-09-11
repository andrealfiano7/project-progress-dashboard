import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const host = req.headers.host || 'localhost:5173';
            const url = new URL(req.url, `http://${host}`);
            const pathname = url.pathname;

            // Polyfill status and json methods for Node http.ServerResponse
            (res as any).status = (code: number) => {
              res.statusCode = code;
              return res;
            };
            (res as any).json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            // Parse body for POST / PUT
            if (req.method === 'POST' || req.method === 'PUT') {
              const buffers: any[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const rawBody = Buffer.concat(buffers).toString();
              try {
                (req as any).body = JSON.parse(rawBody);
              } catch {
                (req as any).body = rawBody;
              }
            }

            // Query parameters
            (req as any).query = Object.fromEntries(url.searchParams.entries());

            if (pathname === '/api/tasks') {
              const { default: handler } = await server.ssrLoadModule('/api/tasks.ts');
              return await handler(req, res);
            }
            if (pathname === '/api/metadata') {
              const { default: handler } = await server.ssrLoadModule('/api/metadata.ts');
              return await handler(req, res);
            }
            if (pathname === '/api/status') {
              const { default: handler } = await server.ssrLoadModule('/api/status.ts');
              return await handler(req, res);
            }
            if (pathname === '/api/seed') {
              const { default: handler } = await server.ssrLoadModule('/api/seed.ts');
              return await handler(req, res);
            }
          } catch (err: any) {
            console.error('Dev API middleware error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err?.message || 'Server error' }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiDevMiddleware()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
