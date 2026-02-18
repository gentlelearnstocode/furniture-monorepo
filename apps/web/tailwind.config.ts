import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/tailwind-config';

const config: Pick<Config, 'content' | 'presets' | 'theme'> = {
  content: ['./app/**/*.tsx', './components/**/*.tsx', '../../packages/ui/src/**/*.tsx'],
  presets: [sharedConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-playfair)', 'serif'],
        serif: ['var(--font-playfair)', 'serif'],
        playfair: ['var(--font-playfair)'],
      },
    },
  },
};

export default config;
