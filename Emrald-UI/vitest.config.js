import { defineConfig } from 'vitest/dist/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    reporters: ['default', 'tap-flat']
  },
});
