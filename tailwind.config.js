/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
	  './pages/**/*.{ts,tsx}',
	  './components/**/*.{ts,tsx}',
	  './app/**/*.{ts,tsx}',
	  './src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
				  '50': '#EFF6FF',
				  '100': '#DBEAFE',
				  '200': '#BFDBFE',
				  '300': '#93C5FD',
				  '400': '#60A5FA',
				  '500': '#3B82F6',
				  '600': '#2563EB',
				  '700': '#1D4ED8',
				  DEFAULT: '#3B82F6'
				},
				surface: {
				  light: {
					base: '#FDFDFD',
					paper: '#F5FAFF',
					elevated: '#FAFDFF'
				  },
				  dark: {
					base: '#030712',
					paper: '#0F172A',
					elevated: '#1E293B'
				  }
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'scroll': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(calc(-50%))' }
				},
				'fade-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'scroll': 'scroll var(--animation-duration, 40s) linear infinite',
				'scroll-reverse': 'scroll var(--animation-duration, 40s) linear infinite reverse',
				'fade-up': 'fade-up 0.5s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
  } 