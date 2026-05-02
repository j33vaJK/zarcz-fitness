import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                md: '2rem',
            },
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
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
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'Oswald', ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                'fluid-h1': 'clamp(2rem, 4.5vw + 1rem, 5rem)',
                'fluid-h2': 'clamp(1.5rem, 3.5vw + 1rem, 3.5rem)',
                'fluid-h3': 'clamp(1.125rem, 2.5vw + 0.5rem, 2.25rem)',
                'fluid-p': 'clamp(0.875rem, 1.2vw + 0.4rem, 1.15rem)',
            },
            spacing: {
                'fluid-section': 'clamp(3rem, 6vw, 6rem)',
                'fluid': 'clamp(1.25rem, 3vw, 2.5rem)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'fade-out': {
                    from: { opacity: '1' },
                    to: { opacity: '0' },
                },
                'slide-in': {
                    from: { transform: 'translateY(10px)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'fade-out': 'fade-out 0.3s ease-out',
                'slide-in': 'slide-in 0.3s ease-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};

export default config;