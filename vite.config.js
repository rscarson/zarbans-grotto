import { defineConfig } from 'vite';
import { resolve } from 'path';
import { name, version } from './package.json';

export default defineConfig({
  define: {
    __VERSION__: `"${version}"`,
  },
  test: {
  },
  build: {
    minify: false,
    rollupOptions: {
      output: {
        banner: () => [
          '/*!',
          ' * ',
          ' * This file is an extension for the Lavendeux parser',
          ' * It is a text-based adventure game playable in:',
          ' * - Lavendeux',
          ' * - Web browser',
          ' * - node.js',
          ' * ',
          ' * https://rscarson.github.io/lavendeux/',
          ' * ',
          ' */',
        ].join('\n')
      }
    },
    lib: {
      entry: resolve(__dirname, 'src/runners/index.js'),
      formats: ['es'],
      name: name,
      fileName() {
        return `${name}.js`;
      },
    },
  },
});