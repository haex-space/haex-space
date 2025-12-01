<script setup lang="ts">
import { Rocket, Store, Shield, RefreshCw, Puzzle, ArrowRight } from 'lucide-vue-next'

const { t } = useI18n()

useSeoMeta({
  title: 'haex.space - Secure Sync & Extensions',
  description: 'Synchronize your data securely across devices and discover powerful extensions for your workflow.',
})
</script>

<template>
  <div class="flex flex-col">
    <!-- Navigation -->
    <header class="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold">
          haex.space
        </NuxtLink>
        <div class="flex items-center gap-4">
          <NuxtLink to="/marketplace" class="text-muted-foreground hover:text-foreground transition-colors">
            {{ t('common.marketplace') }}
          </NuxtLink>
          <NuxtLink to="/auth/login">
            <ShadcnButton variant="outline">{{ t('common.login') }}</ShadcnButton>
          </NuxtLink>
          <NuxtLink to="/auth/register">
            <ShadcnButton>{{ t('common.register') }}</ShadcnButton>
          </NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-24 text-center">
      <ShadcnBadge variant="secondary" class="mb-4">
        {{ t('home.badge') }}
      </ShadcnBadge>
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        {{ t('home.title') }}
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        {{ t('home.subtitle') }}
      </p>
      <div class="flex gap-4 justify-center">
        <NuxtLink to="/auth/register">
          <ShadcnButton size="lg" class="gap-2">
            <Rocket class="w-5 h-5" />
            {{ t('home.cta.createAccount') }}
          </ShadcnButton>
        </NuxtLink>
        <NuxtLink to="/marketplace">
          <ShadcnButton size="lg" variant="outline" class="gap-2">
            <Store class="w-5 h-5" />
            {{ t('home.cta.browseExtensions') }}
          </ShadcnButton>
        </NuxtLink>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <ShadcnCard>
          <ShadcnCardHeader>
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield class="w-6 h-6 text-primary" />
            </div>
            <ShadcnCardTitle>{{ t('home.features.encryption.title') }}</ShadcnCardTitle>
            <ShadcnCardDescription>
              {{ t('home.features.encryption.description') }}
            </ShadcnCardDescription>
          </ShadcnCardHeader>
        </ShadcnCard>

        <ShadcnCard>
          <ShadcnCardHeader>
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <RefreshCw class="w-6 h-6 text-primary" />
            </div>
            <ShadcnCardTitle>{{ t('home.features.sync.title') }}</ShadcnCardTitle>
            <ShadcnCardDescription>
              {{ t('home.features.sync.description') }}
            </ShadcnCardDescription>
          </ShadcnCardHeader>
        </ShadcnCard>

        <ShadcnCard>
          <ShadcnCardHeader>
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Puzzle class="w-6 h-6 text-primary" />
            </div>
            <ShadcnCardTitle>{{ t('home.features.extensions.title') }}</ShadcnCardTitle>
            <ShadcnCardDescription>
              {{ t('home.features.extensions.description') }}
            </ShadcnCardDescription>
          </ShadcnCardHeader>
        </ShadcnCard>
      </div>
    </section>

    <!-- Marketplace CTA Section -->
    <section class="bg-muted/50 py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">
          {{ t('home.marketplaceCta.title') }}
        </h2>
        <p class="text-muted-foreground max-w-xl mx-auto mb-8">
          {{ t('home.marketplaceCta.description') }}
        </p>
        <NuxtLink to="/marketplace">
          <ShadcnButton size="lg" variant="secondary" class="gap-2">
            <ArrowRight class="w-5 h-5" />
            {{ t('home.marketplaceCta.button') }}
          </ShadcnButton>
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border mt-auto">
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
