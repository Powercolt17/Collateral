/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['IBM Plex Sans', 'sans-serif'],
                mono: ['IBM Plex Mono', 'monospace'],
                display: ['IBM Plex Sans', 'sans-serif'],
            },
            colors: {
                neutral: {
                    50: '#F7F7F6',
                    900: '#111111',
                },
            }
        },
    },
    plugins: [],
}
