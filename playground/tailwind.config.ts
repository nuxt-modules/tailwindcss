import typography from '@tailwindcss/typography'
import colors from 'tailwindcss/colors'

export default {
  theme: {
    extend: {
      colors: {
        brand: colors.teal['500'],
      },
      fontFamily: {
        sans: 'Inter, ui-sans-serif, system-ui, -apple-system, Arial, Roboto, sans-serif',
      },
    },
  },
  plugins: [
    typography(),
  ],
}
