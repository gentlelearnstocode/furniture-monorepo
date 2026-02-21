import type { Config } from 'tailwindcss';

const config: Omit<Config, 'content'> = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        brand: ['var(--font-brand)', 'serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          primary: {
            50: 'hsl(var(--brand-primary-50))',
            100: 'hsl(var(--brand-primary-100))',
            200: 'hsl(var(--brand-primary-200))',
            300: 'hsl(var(--brand-primary-300))',
            400: 'hsl(var(--brand-primary-400))',
            500: 'hsl(var(--brand-primary-500))',
            600: 'hsl(var(--brand-primary-600))',
            700: 'hsl(var(--brand-primary-700))',
            800: 'hsl(var(--brand-primary-800))',
            900: 'hsl(var(--brand-primary-900))',
          },
          accent1: {
            50: 'hsl(var(--brand-accent1-50))',
            100: 'hsl(var(--brand-accent1-100))',
            200: 'hsl(var(--brand-accent1-200))',
            300: 'hsl(var(--brand-accent1-300))',
            400: 'hsl(var(--brand-accent1-400))',
            500: 'hsl(var(--brand-accent1-500))',
            600: 'hsl(var(--brand-accent1-600))',
            700: 'hsl(var(--brand-accent1-700))',
            800: 'hsl(var(--brand-accent1-800))',
            900: 'hsl(var(--brand-accent1-900))',
          },
          accent2: {
            50: 'hsl(var(--brand-accent2-50))',
            100: 'hsl(var(--brand-accent2-100))',
            200: 'hsl(var(--brand-accent2-200))',
            300: 'hsl(var(--brand-accent2-300))',
            400: 'hsl(var(--brand-accent2-400))',
            500: 'hsl(var(--brand-accent2-500))',
            600: 'hsl(var(--brand-accent2-600))',
            700: 'hsl(var(--brand-accent2-700))',
            800: 'hsl(var(--brand-accent2-800))',
            900: 'hsl(var(--brand-accent2-900))',
          },
          neutral: {
            50: 'hsl(var(--brand-neutral-50))',
            100: 'hsl(var(--brand-neutral-100))',
            200: 'hsl(var(--brand-neutral-200))',
            300: 'hsl(var(--brand-neutral-300))',
            400: 'hsl(var(--brand-neutral-400))',
            500: 'hsl(var(--brand-neutral-500))',
            600: 'hsl(var(--brand-neutral-600))',
            700: 'hsl(var(--brand-neutral-700))',
            800: 'hsl(var(--brand-neutral-800))',
            900: 'hsl(var(--brand-neutral-900))',
          },
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
