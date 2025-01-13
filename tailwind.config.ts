import type { Config } from "tailwindcss";
const svgToDataUri = require("mini-svg-data-uri");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1900px',
        '4xl': '2200px'
      },
      colors: {
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
        text: {
          light: {
            primary: '#1F2937',
            secondary: '#4B5563',
            disabled: '#9CA3AF'
          },
          dark: {
            primary: '#FFFFFF',
            secondary: '#8B949E',
            disabled: '#6B7280'
          }
        },
        feedback: {
          error: {
            light: '#EF4444',
            dark: '#F87171'
          },
          warning: {
            light: '#F59E0B',
            dark: '#FBBF24'
          },
          success: {
            light: '#10B981',
            dark: '#34D399'
          },
          info: {
            light: '#3B82F6',
            dark: '#60A5FA'
          }
        },
        ui: {
          light: {
            divider: '#E5E7EB',
            card: '#FFFFFF',
            hover: 'rgba(59, 130, 246, 0.1)'
          },
          dark: {
            divider: '#30363D',
            card: '#0D1117',
            hover: 'rgba(59, 130, 246, 0.1)'
          }
        },
        activity: {
          light: {
            empty: '#F3F4F6',
            filled: '#3B82F6',
            hover: '#2563EB'
          },
          dark: {
            empty: '#21262D',
            filled: '#3B82F6',
            hover: '#2563EB'
          }
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
          light: 'hsl(220 13% 91%)',
          dark: 'hsl(240 3.7% 15.9%)'
        },
        'grid-light': 'rgba(0, 0, 0, 0.1)',
        'grid-dark': 'rgba(255, 255, 255, 0.2)',
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
      boxShadow: {
        'elevation-1': '0 2px 4px rgba(59, 130, 246, 0.05)',
        'elevation-2': '0 4px 8px rgba(59, 130, 246, 0.08)',
        'elevation-3': '0 8px 16px rgba(59, 130, 246, 0.12)',
        'dark-elevation-1': '0 2px 4px rgba(0,0,0,0.25)',
        'dark-elevation-2': '0 4px 8px rgba(0,0,0,0.3)',
        'dark-elevation-3': '0 8px 16px rgba(0,0,0,0.35)'
      },
      animation: {
        scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
        spotlight: 'spotlight 2s ease .75s 1 forwards'
      },
      keyframes: {
        scroll: {
          to: {
            transform: 'translate(calc(-50% - 0.5rem))'
          }
        },
        spotlight: {
          '0%': {
            opacity: 0,
            transform: 'translate(-72%, -62%) scale(0.5)'
          },
          '100%': {
            opacity: 1,
            transform: 'translate(-50%,-40%) scale(1)'
          }
        }
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100" height="100" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"))
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  )

  addBase({
    ":root": newVars,
  })
}

export default config;
