import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
				clarity: {
					50: '#F9F8FF',
					100: '#EDE9FE',
					500: '#6D28D9',
					600: '#4F46E5',
					900: '#111827',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors mapped to the original wellness palette.
				softBlue: {
					DEFAULT: '#174A4A', 50: '#F8F7F3', 100: '#E7EFEC', 200: '#D2E1DC', 300: '#B7CDC5', 400: '#6F9085', 500: '#174A4A', 600: '#103838', 700: '#0D2E2E', 800: '#092424', 900: '#061A1A',
				},
				teal: {
					DEFAULT: '#6F9085', 50: '#F3F7F5', 100: '#E7EFEC', 200: '#D2E1DC', 300: '#B7CDC5', 400: '#6F9085', 500: '#5D8175', 600: '#4F6F65', 700: '#3F5C53', 800: '#30483F', 900: '#20332D',
				},
				coral: {
					DEFAULT: '#C9A227', 50: '#FCFAF0', 100: '#F5EED2', 200: '#EBDD9F', 300: '#DEC96B', 400: '#D2B746', 500: '#C9A227', 600: '#A9871C', 700: '#806613', 800: '#5B470E', 900: '#382B08',
				},
				lavender: {
					50: '#F8F7F3', 100: '#E7EFEC', 200: '#D2E1DC', 300: '#B7CDC5', 400: '#6F9085', 500: '#174A4A', 600: '#103838', 700: '#0D2E2E', 800: '#092424', 900: '#061A1A',
				},
				peach: {
					100: '#FEF7CD', 200: '#FDE1D3', 300: '#FEC6A1',
				},
				soft: {
					green: '#F2FCE2', blue: '#D3E4FD', gray: '#F1F0FB', pink: '#FFDEE2',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-up': 'fade-up 0.7s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
