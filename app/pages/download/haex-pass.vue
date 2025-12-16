<script setup lang="ts">
import { Download, ExternalLink, Shield, Key, Fingerprint } from 'lucide-vue-next'

const { t } = useI18n()

useSeoMeta({
  title: 'Download haex-pass - haex.space',
  description: 'Download the haex-pass browser extension for Firefox and Chrome. Secure password management integrated with haex-vault.',
})

interface ReleaseAsset {
  name: string
  browser_download_url: string
  size: number
}

interface Release {
  tag_name: string
  assets: ReleaseAsset[]
}

const { data: release, pending } = await useFetch<Release>(
  'https://api.github.com/repos/haex-space/haextension/releases/latest',
  {
    transform: (data: Release) => ({
      tag_name: data.tag_name,
      assets: data.assets.map((a) => ({
        name: a.name,
        browser_download_url: a.browser_download_url,
        size: a.size,
      })),
    }),
  },
)

const version = computed(() => {
  const tag = release.value?.tag_name || ''
  return tag.replace('haex-pass-browser-v', '').replace('v', '') || '...'
})

function getAssetUrl(pattern: string): string {
  if (!release.value?.assets) return '#'
  const asset = release.value.assets.find((a) => a.name.includes(pattern))
  return asset?.browser_download_url || '#'
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

function getAssetSize(pattern: string): string {
  if (!release.value?.assets) return ''
  const asset = release.value.assets.find((a) => a.name.includes(pattern))
  return asset ? formatSize(asset.size) : ''
}

const browsers = computed(() => [
  {
    id: 'firefox',
    name: 'Firefox',
    icon: 'simple-icons:firefox',
    description: t('downloadPass.firefox.description'),
    downloads: [
      { label: t('downloadPass.firefox.addon'), pattern: '.xpi' },
    ],
  },
  {
    id: 'chrome',
    name: 'Chrome / Chromium',
    icon: 'simple-icons:googlechrome',
    description: t('downloadPass.chrome.description'),
    downloads: [
      { label: t('downloadPass.chrome.extension'), pattern: '.zip' },
    ],
  },
])

const features = computed(() => [
  {
    icon: Shield,
    title: t('downloadPass.features.secure.title'),
    description: t('downloadPass.features.secure.description'),
  },
  {
    icon: Key,
    title: t('downloadPass.features.autofill.title'),
    description: t('downloadPass.features.autofill.description'),
  },
  {
    icon: Fingerprint,
    title: t('downloadPass.features.integration.title'),
    description: t('downloadPass.features.integration.description'),
  },
])
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="container mx-auto px-4 py-16 text-center">
      <Badge variant="secondary" class="mb-4">
        {{ t('downloadPass.badge') }}
      </Badge>
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {{ t('downloadPass.title') }}
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
        {{ t('downloadPass.subtitle') }}
      </p>
      <p class="text-sm text-muted-foreground">
        {{ t('downloadPass.currentVersion') }}: <span class="font-mono">v{{ version }}</span>
        <a
          href="https://github.com/haex-space/haextension/releases"
          target="_blank"
          class="inline-flex items-center gap-1 ml-2 text-primary hover:underline"
        >
          {{ t('downloadPass.allReleases') }}
          <ExternalLink class="w-3 h-3" />
        </a>
      </p>
    </section>

    <!-- Browser Downloads -->
    <section class="container mx-auto px-4 pb-12">
      <h2 class="text-2xl font-bold mb-6">{{ t('downloadPass.browsers') }}</h2>
      <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card v-for="browser in browsers" :key="browser.id" class="relative overflow-hidden">
          <CardHeader>
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon :name="browser.icon" class="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>{{ browser.name }}</CardTitle>
                <p class="text-sm text-muted-foreground">v{{ version }}</p>
              </div>
            </div>
            <CardDescription>
              {{ browser.description }}
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <template v-if="pending">
              <div class="h-12 rounded-lg bg-muted animate-pulse" />
            </template>
            <a
              v-else
              v-for="download in browser.downloads"
              :key="download.pattern"
              :href="getAssetUrl(download.pattern)"
              class="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors group"
            >
              <div>
                <span class="text-sm font-medium">{{ download.label }}</span>
                <span class="text-xs text-muted-foreground ml-2">{{ getAssetSize(download.pattern) }}</span>
              </div>
              <Download class="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Installation Instructions -->
    <section class="container mx-auto px-4 pb-12">
      <h2 class="text-2xl font-bold mb-6 text-center">{{ t('downloadPass.installation.title') }}</h2>
      <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon name="simple-icons:firefox" class="w-5 h-5" />
              Firefox
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol class="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>{{ t('downloadPass.installation.firefox.step1') }}</li>
              <li>{{ t('downloadPass.installation.firefox.step2') }}</li>
              <li>{{ t('downloadPass.installation.firefox.step3') }}</li>
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon name="simple-icons:googlechrome" class="w-5 h-5" />
              Chrome / Chromium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol class="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>{{ t('downloadPass.installation.chrome.step1') }}</li>
              <li>{{ t('downloadPass.installation.chrome.step2') }}</li>
              <li>{{ t('downloadPass.installation.chrome.step3') }}</li>
              <li>{{ t('downloadPass.installation.chrome.step4') }}</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Features -->
    <section class="container mx-auto px-4 py-16">
      <h2 class="text-2xl font-bold text-center mb-8">
        {{ t('downloadPass.whyHaexPass') }}
      </h2>
      <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card v-for="feature in features" :key="feature.title">
          <CardHeader>
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <component :is="feature.icon" class="w-5 h-5 text-primary" />
            </div>
            <CardTitle class="text-lg">{{ feature.title }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
</template>
