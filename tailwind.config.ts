import type { Config } from 'tailwindcss';

/**
 * Paleta de marca Tropicaña:
 *  - Verde Caña Profundo #1B3B2B (Sidebar / headers)
 *  - Dorado Ámbar #D4A359 (acentos, badges, botones primarios)
 *  - Crema Vainilla #FAF5EF (fondo de UI)
 *  - Tierra Oscuro #2C1D11 (textos)
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#1B3B2B',
          greenDark: '#12291D',
          greenDarker: '#0B1B13',
          gold: '#D4A359',
          goldLight: '#E7C68F',
          goldDark: '#B8863B',
          cream: '#FAF5EF',
          creamDark: '#F1E5D4',
          tierra: '#2C1D11',
          tierraMuted: '#7A6248',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(44 29 17 / 0.08), 0 1px 2px -1px rgb(44 29 17 / 0.06)',
        pop: '0 14px 34px -14px rgb(27 59 43 / 0.35)',
      },
      borderRadius: {
        xl: '0.9rem',
      },
    },
  },
  plugins: [],
};

export default config;