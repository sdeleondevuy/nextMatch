/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Nueva paleta de colores
        lime: {
          50: '#f7fef0',
          100: '#ecfdf5',
          200: '#d1fae5',
          300: '#a7f3d0',
          400: '#6ee7b7',
          500: '#94E41D', // Verde Lima principal
          600: '#7cc21a',
          700: '#65a017',
          800: '#4e7e13',
          900: '#375c0f',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#1DA0E4', // Azul Cian principal
          600: '#1a8bc7',
          700: '#1776aa',
          800: '#14618d',
          900: '#114c70',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#E4871D', // Naranja/Ámbar principal
          600: '#c76f1a',
          700: '#aa5a17',
          800: '#8d4514',
          900: '#703011',
        },
        royal: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1D4AE4', // Azul Oscuro/Real principal
          600: '#1a3ec7',
          700: '#1732aa',
          800: '#14268d',
          900: '#111a70',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#2D9A3B', // Verde Oscuro/Saturado principal
          600: '#2a8a35',
          700: '#267a2f',
          800: '#226a29',
          900: '#1e5a23',
        },
        // Colores de utilidad
        primary: '#1D4AE4', // Azul Real como color primario
        secondary: '#1DA0E4', // Azul Cian como secundario
        accent: '#E4871D', // Naranja como acento
        success: '#94E41D', // Verde Lima como éxito
        forest: '#2D9A3B', // Verde Oscuro/Saturado
      }
    },
  },
  plugins: [],
}
