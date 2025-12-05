<script setup lang="ts">
import { Download, Store, Shield, RefreshCw, Puzzle, Layers, WifiOff, Lock, ArrowRight, GitMerge, HardDrive, Server } from 'lucide-vue-next'

const { t } = useI18n()

useSeoMeta({
  title: 'haex.space - Secure Sync & Extensions',
  description: 'Synchronize your data securely across devices and discover powerful extensions for your workflow.',
})

const features = computed(() => [
  { icon: Shield, title: t('home.features.encryption.title'), description: t('home.features.encryption.description') },
  { icon: Lock, title: t('home.features.privacy.title'), description: t('home.features.privacy.description') },
  { icon: WifiOff, title: t('home.features.offline.title'), description: t('home.features.offline.description') },
  { icon: RefreshCw, title: t('home.features.sync.title'), description: t('home.features.sync.description') },
  { icon: Puzzle, title: t('home.features.extensions.title'), description: t('home.features.extensions.description') },
  { icon: Layers, title: t('home.features.crossPlatform.title'), description: t('home.features.crossPlatform.description') },
  { icon: GitMerge, title: t('home.features.crdt.title'), description: t('home.features.crdt.description') },
  { icon: HardDrive, title: t('home.features.localStorage.title'), description: t('home.features.localStorage.description') },
  { icon: Server, title: t('home.features.selfHostable.title'), description: t('home.features.selfHostable.description') },
])
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
        <NuxtLinkLocale to="/download">
          <Button size="lg" class="gap-2">
            <Download class="w-5 h-5" />
            {{ t('home.cta.download') }}
          </Button>
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/marketplace">
          <Button size="lg" variant="outline" class="gap-2">
            <Store class="w-5 h-5" />
            {{ t('home.cta.browseExtensions') }}
          </Button>
        </NuxtLinkLocale>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 py-16">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          v-for="(feature, index) in features"
          :key="index"
          :icon="feature.icon"
          :title="feature.title"
          :description="feature.description"
        />
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
        <NuxtLinkLocale to="/marketplace">
          <Button size="lg" variant="secondary" class="gap-2">
            <ArrowRight class="w-5 h-5" />
            {{ t('home.marketplaceCta.button') }}
          </Button>
        </NuxtLinkLocale>
      </div>
    </section>
  </div>
</template>
