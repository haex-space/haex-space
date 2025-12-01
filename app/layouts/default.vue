<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navigation -->
    <header class="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50">
      <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img src="/logo.png" alt="haex.space" class="h-8 w-auto" />
          </NuxtLink>
          <div class="hidden md:flex items-center gap-6">
            <NuxtLink
              to="/download"
              class="text-muted-foreground hover:text-foreground transition-colors"
              active-class="!text-foreground font-medium"
            >
              {{ t('common.download') }}
            </NuxtLink>
            <NuxtLink
              to="/marketplace"
              class="text-muted-foreground hover:text-foreground transition-colors"
              active-class="!text-foreground font-medium"
            >
              {{ t('common.marketplace') }}
            </NuxtLink>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/auth/login">
            <Button variant="outline">{{ t('common.login') }}</Button>
          </NuxtLink>
          <NuxtLink to="/auth/register">
            <Button>{{ t('common.register') }}</Button>
          </NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-border">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-muted-foreground">
            &copy; {{ new Date().getFullYear() }} haex.space. {{ t('common.allRightsReserved') }}
          </p>
          <div class="flex gap-6 text-sm text-muted-foreground">
            <NuxtLink to="/privacy" class="hover:text-foreground transition-colors">
              {{ t('common.privacy') }}
            </NuxtLink>
            <NuxtLink to="/terms" class="hover:text-foreground transition-colors">
              {{ t('common.terms') }}
            </NuxtLink>
            <a href="https://github.com/haex-space" target="_blank" class="hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
