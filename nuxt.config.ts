import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],

  build: {
    transpile: ["@supabase/supabase-js"],
  },

  runtimeConfig: {
    githubToken: process.env.NUXT_GITHUB_TOKEN,
    public: {
      marketplaceSupabaseUrl: process.env.NUXT_PUBLIC_MARKETPLACE_SUPABASE_URL,
      marketplaceSupabaseKey: process.env.NUXT_PUBLIC_MARKETPLACE_SUPABASE_KEY,
      marketplaceApiUrl: process.env.NUXT_PUBLIC_MARKETPLACE_API_URL,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      preserveSymlinks: false,
    },
    optimizeDeps: {
      exclude: ["@vueuse/core"],
      include: ["@supabase/supabase-js"],
    },
  },

  modules: [
    "@nuxtjs/i18n",
    "shadcn-nuxt",
    "@nuxt/icon",
    "@nuxtjs/mdc",
    "@nuxtjs/color-mode",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@nuxtjs/turnstile",
  ],

  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
    secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    addValidateEndpoint: true,
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/confirm",
      exclude: ["/*"], // Exclude all routes from auth redirect
    },
  },

  colorMode: {
    classSuffix: "",
  },

  icon: {
    serverBundle: "auto",
  },

  mdc: {
    highlight: {
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
      langs: [
        "typescript",
        "javascript",
        "vue",
        "vue-html",
        "tsx",
        "jsx",
        "bash",
        "json",
        "svelte",
        "html",
        "css",
        "sql",
        "rust",
      ],
    },
  },

  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },

  i18n: {
    locales: [
      { code: "en", name: "English", file: "en.ts" },
      { code: "de", name: "Deutsch", file: "de.ts" },
    ],
    defaultLocale: "en",
    langDir: "../i18n/locales",
    strategy: "prefix_except_default",
  },
});
