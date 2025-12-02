import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      preserveSymlinks: false,
    },
    optimizeDeps: {
      exclude: ['@vueuse/core'],
    },
  },

  modules: ['@nuxtjs/i18n', 'shadcn-nuxt', '@nuxt/icon', '@nuxtjs/mdc', '@nuxtjs/color-mode'],

  colorMode: {
    classSuffix: '',
  },

  mdc: {
    highlight: {
      theme: {
        light: 'github-light',
        dark: 'github-dark',
      },
      langs: ['typescript', 'javascript', 'vue', 'vue-html', 'tsx', 'jsx', 'bash', 'json', 'svelte', 'html', 'css'],
    },
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
    ],
    defaultLocale: 'en',
    langDir: '../i18n/locales',
    strategy: 'prefix_except_default',
  },
})
