export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                ink: '#17211f',
                muted: '#66746f',
                line: '#d9e2df',
                canvas: '#f7faf8',
                brand: {
                    50: '#edf8f4',
                    100: '#d7f0e7',
                    500: '#1c8f73',
                    600: '#13725d',
                    700: '#105b4c'
                },
                amber: {
                    50: '#fff8e6',
                    500: '#ba7b16'
                }
            },
            boxShadow: {
                soft: '0 14px 35px rgba(30, 49, 43, 0.08)'
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
            }
        }
    },
    plugins: []
};
