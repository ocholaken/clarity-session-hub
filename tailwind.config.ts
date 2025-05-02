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
				// Custom colors mapped to our palette
				softBlue: {
					DEFAULT: '#4A90E2',
					50: '#EBF3FC',
					100: '#D6E7F8',
					200: '#ADD0F1',
					300: '#85B8EA',
					400: '#5CA1E3',
					500: '#4A90E2', // Primary color
					600: '#1F77D6',
					700: '#185CAA',
					800: '#12447F',
					900: '#0C2C53',
				},
				teal: {
					DEFAULT: '#50E3C2',
					50: '#E6FBF6',
					100: '#CDF7ED',
					200: '#9AEFDC',
					300: '#67E7CB',
					400: '#50E3C2', // Secondary color
					500: '#24D9AE',
					600: '#1BAB89',
					700: '#147D64',
					800: '#0D4E3F',
					900: '#06201A',
				},
				coral: {
					DEFAULT: '#FF6F61',
					50: '#FFF1F0',
					100: '#FFE4E1',
					200: '#FFC9C3',
					300: '#FFAEA5',
					400: '#FF9183',
					500: '#FF6F61', // Accent/CTA color
					600: '#FF3A27',
					700: '#EC1400',
					800: '#B41000',
					900: '#7C0B00',
				},
				// Keep existing colors
				lavender: {
					100: '#e5deff',
					200: '#d6bcfa',
					300: '#b794f4',
					400: '#9b87f5',
					500: '#805ad5',
					600: '#7E69AB',
					700: '#6E59A5',
					800: '#553c9a',
					900: '#1A1F2C',
				},
				peach: {
					100: '#FEF7CD',
					200: '#FDE1D3',
					300: '#FEC6A1',
				},
				soft: {
					green: '#F2FCE2',
					blue: '#D3E4FD',
					gray: '#F1F0FB',
					pink: '#FFDEE2',
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
