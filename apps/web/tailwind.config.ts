import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/tailwind-config';

const config: Pick<Config, 'content' | 'presets' | 'theme'> = {
  content: ['./app/**/*.tsx', './components/**/*.tsx', '../../packages/ui/src/**/*.tsx'],
  presets: [sharedConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-uvn-hongha)', 'sans-serif'],
        serif: ['var(--font-uvn-hongha)', 'serif'],
        playfair: ['var(--font-uvn-hongha)'],
        uvnhongha: ['var(--font-uvn-hongha)', 'sans-serif'],
      },
    },
  },
};

export default config;
