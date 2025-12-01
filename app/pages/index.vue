<script setup lang="ts">
import { Rocket, Store, Shield, RefreshCw, Puzzle, ArrowRight } from 'lucide-vue-next'

const { t } = useI18n()

useSeoMeta({
  title: 'haex.space - Secure Sync & Extensions',
  description: 'Synchronize your data securely across devices and discover powerful extensions for your workflow.',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-24 text-center">
      <Badge variant="secondary" class="mb-4">
        {{ t('home.badge') }}
      </Badge>
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        {{ t('home.title') }}
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        {{ t('home.subtitle') }}
      </p>
      <div class="flex gap-4 justify-center">
        <NuxtLink to="/auth/register">
          <Button size="lg" class="gap-2">
            <Rocket class="w-5 h-5" />
            {{ t('home.cta.createAccount') }}
          </Button>
        </NuxtLink>
        <NuxtLink to="/marketplace">
          <Button size="lg" variant="outline" class="gap-2">
            <Store class="w-5 h-5" />
            {{ t('home.cta.browseExtensions') }}
          </Button>
        </NuxtLink>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield class="w-6 h-6 text-primary" />
            </div>
            <CardTitle>{{ t('home.features.encryption.title') }}</CardTitle>
            <CardDescription>
              {{ t('home.features.encryption.description') }}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <RefreshCw class="w-6 h-6 text-primary" />
            </div>
            <CardTitle>{{ t('home.features.sync.title') }}</CardTitle>
            <CardDescription>
              {{ t('home.features.sync.description') }}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Puzzle class="w-6 h-6 text-primary" />
            </div>
            <CardTitle>{{ t('home.features.extensions.title') }}</CardTitle>
            <CardDescription>
              {{ t('home.features.extensions.description') }}
            </CardDescription>
          </CardHeader>
        </Card>
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
          <Button size="lg" variant="secondary" class="gap-2">
            <ArrowRight class="w-5 h-5" />
            {{ t('home.marketplaceCta.button') }}
          </Button>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
