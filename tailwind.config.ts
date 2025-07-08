import type { Config } from "tailwindcss";

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  safelist: [
    // Layout classes
    'h-screen', 'w-full', 'h-full', 'relative', 'absolute', 'overflow-auto',
    // Positioning
    'top-4', 'left-4', 'left-16', 'right-4', 'bottom-4', 'left-1/2', 'top-1/2', 'top-20', 'left-0', 'top-0',
    'transform', '-translate-x-1/2', '-translate-y-1/2',
    // Z-index and display
    'z-10', 'z-20', 'z-50', 'flex', 'flex-col', 'items-center', 'justify-center', 'gap-2',
    // Typography
    'text-xl', 'text-lg', 'text-sm', 'text-xs', 'font-bold', 'font-medium', 'font-semibold',
    // Colors and backgrounds
    'text-gray-800', 'text-gray-400', 'text-gray-600', 'text-gray-500', 'text-gray-700', 'text-gray-300', 'text-white',
    'bg-white', 'bg-black', 'bg-gray-50', 'bg-gray-100', 'bg-red-50', 'bg-gray-900', 'bg-gray-700',
    'hover:bg-gray-800', 'hover:bg-gray-100', 'hover:bg-red-50', 'hover:bg-gray-700', 'hover:bg-transparent',
    'hover:text-white', 'hover:text-gray-300',
    // Borders and shapes
    'rounded-full', 'rounded-lg', 'border', 'shadow-md', 'shadow-lg', 'shadow-xl',
    'hover:shadow-lg', 'hover:shadow-xl',
    // Transitions and animations
    'transition-all', 'transition-shadow', 'transition-colors', 'duration-200',
    // Sizing
    'w-4', 'h-4', 'w-6', 'h-6', 'w-8', 'h-8', 'w-12', 'h-12', 'w-24', 'w-64',
    // Spacing
    'p-2', 'p-4', 'p-6', 'pb-2', 'py-4', 'mt-4', 'mt-6', 'mb-4', 'mx-4', 'max-w-md',
    // Background opacity
    'bg-white/90', 'bg-black/50',
    // Cursor
    'cursor-move', 'cursor-pointer',
    // Hover states
    'hover:scale-1.05',
    // Disabled states
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
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
  			}
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
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
