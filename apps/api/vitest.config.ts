import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@watchpost/shared-types': path.resolve(__dirname, '../../packages/shared-types/src/index.ts'),
    },
  },
});
