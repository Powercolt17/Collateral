/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Inter Tight', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                neutral: {
                    50: '#F7F7F6',
                    100: '#F0F0F0',
                    200: '#D9DBE1',
                    300: '#B0B2B8',
                    400: '#8A8D94',
                    500: '#6B6E76',
                    600: '#4D5057',
                    700: '#33353A',
                    800: '#1E1F23',
                    900: '#0E0E11',
                },
                brand: {
                    red: '#921818',
                    'red-hover': '#751212',
                    gold: '#A18239',
                    'gold-subtle': '#947C43',
                    green: '#1F7A4D',
                    'green-dim': '#E8F4ED',
                },
            },
            animation: {
                'activate': 'activate 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            },
            keyframes: {
                activate: {
                    '0%': { opacity: '0', transform: 'translateY(4px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
