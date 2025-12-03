<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: 'Privacy Policy - haex.space',
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-border">
      <nav class="container mx-auto px-4 h-16 flex items-center">
        <NuxtLinkLocale to="/" class="text-xl font-bold">
          haex.space
        </NuxtLinkLocale>
      </nav>
    </header>

    <main class="flex-1 container mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-8">{{ t('common.privacy') }}</h1>
      <p class="text-muted-foreground">Coming soon.</p>
    </main>

    <footer class="border-t border-border">
      <div class="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} haex.space. {{ t('common.allRightsReserved') }}
      </div>
    </footer>
  </div>
</template>
