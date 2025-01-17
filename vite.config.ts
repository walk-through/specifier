import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist', // Output directory for build
  },
  base: '/specifier/', // Replace with your repository name
  plugins: [react()],
  test: {
    globals: true, // Makes test helpers globally available
    reporters: ['default','junit'],
    outputFile: '../tests.xml',
    //environment: 'jsdom', // Optional, depending on your needs, need to add jsdom library to emulate the dom
    //setupFiles: ['./src/setupTests.ts'], // Include if you need setup before tests
  },
})
