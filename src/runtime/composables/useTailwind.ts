import { useHead } from '#imports'
import tailwindStylesSrc from '#tailwind/styles-path'

type TailwindModuleUtilities = {
  loadTailwindStyles: () => void
}

export default function useTailwind(): TailwindModuleUtilities {
  return {
    loadTailwindStyles() {
      useHead({
        style: [
          { src: tailwindStylesSrc, key: '__tailwind.styles', type: 'text/css' },
        ],
      })
    },
  }
}
