<template>
  <div class="container relative mx-auto px-2 py-6 md:px-12 max-w-4xl md:py-12">
    <h1>Tailwind Colors</h1>
    <div v-for="color of Object.keys(colors)" :key="color" class="mb-6">
      <h2>{{ color }}</h2>
      <span class="flex space-x-2">
        <span
          v-for="value of keys(colors[color])"
          :id="`${color}-${value}`"
          :key="value"
          class="color-box flex-grow py-6 md:py-8 rounded cursor-pointer"
          :class="[value === 'DEFAULT' ? `bg-${color}` : `bg-${color}-${value}`, color === 'white' ? 'border' : '']"
          @click="select(color, value)"
        />
      </span>
    </div>
    <div
      class="copy-box rounded-md bg_white"
      :class="boxClasses"
    >
      <span
        v-if="!selected"
        class="select-color"
      >Select a color</span>
      <div v-else>
        <pre
          :class="selected.bgClass"
          @click="copy(selected.bgClass)"
        >{{ copied === selected.bgClass ? 'Copied!' : selected.bgClass }}</pre>
        <pre
          :class="selected.textClass"
          @click="copy(selected.textClass)"
        >{{
            copied === selected.textClass ? 'Copied!' : selected.textClass
        }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { theme } from '~tailwind.config'

export default {
  layout: 'tw',
  data () {
    // Remove unecessary colors
    delete theme.colors.current
    delete theme.colors.transparent

    return {
      colors: theme.colors,
      selected: null,
      copied: ''
    }
  },
  computed: {
    boxClasses () {
      if (!this.selected) {
        return 'bg-white border-2 border-stone text-stone'
      }
      const textColor =
        this.selected.type === 'dark'
          ? 'text_white'
          : 'text_black bg_black'
      return `border-${this.selected.class} ${textColor}`
    }
  },
  methods: {
    keys (color) {
      if (typeof color === 'string') {
        return ['DEFAULT']
      }
      return Object.keys(color)
    },
    select (color, value) {
      if (
        this.selected &&
        this.selected.color === color &&
        this.selected.value === value
      ) {
        this.selected = null
        return
      }
      let colorValue = this.colors[color]
      if (typeof colorValue !== 'string') {
        colorValue = colorValue[value]
      }
      const twClass = value === 'DEFAULT' ? `${color}` : `${color}-${value}`
      this.selected = {
        color,
        value,
        type: this.lightOrDark(color, value),
        class: twClass,
        bgClass: `bg-${twClass}`,
        textClass: `text-${twClass}`
      }
    },
    lightOrDark (color, value) {
      const el = document.getElementById(`${color}-${value}`)
      const colorValue = window.getComputedStyle(el).backgroundColor
      const [r, g, b] = colorValue.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/).slice(1)

      // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
      const hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
      )

      // Using the HSP value, determine whether the color is light or dark
      if (hsp > 127.5) {
        return 'light'
      }
      return 'dark'
    },
    async copy (text) {
      if (!navigator.clipboard) { return }
      this._timeout && clearTimeout(this._timeout)
      await navigator.clipboard.writeText(text)
      this.copied = text
      this._timeout = setTimeout(() => {
        this.copied = ''
      }, 500)
    }
  }
}
</script>

<style scoped>
/* compatibility with Tailwind V1 or overwriting some styles */
h1 {
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
}
h2 {
  font-size: 1.5rem;
  line-height: 2rem;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
  font-weight: 500;
}
.color-box {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.color-box:hover {
  transform: scale(1.1);
}
.copy-box {
  position: fixed;
  top: 1rem;
  right: 1rem;
  min-width: 14rem;
  height: 6rem;
  text-align: center;
}
.copy-box .select-color {
  line-height: 6rem;
}
.copy-box pre {
  cursor: pointer;
  height: 3rem;
  line-height: 3rem;
  padding: 0 1rem;
}
@media (min-width: 1420px) {
  .copy-box {
    top: 50%;
    margin-top: -4rem;
    right: 4rem;
    bottom: 3rem;
    height: 8rem;
  }
  .copy-box .select-color {
    line-height: 8rem;
  }
  .copy-box pre {
    height: 4rem;
    line-height: 4rem;
  }
}

.text_white {
  color: white;
}
.text_black {
  color: black;
}
.bg_white {
  background: white;
}
.bg_black {
  background: #111;
}
</style>
