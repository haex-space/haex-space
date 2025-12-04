<script setup lang="ts">
import { Download, Shield, RefreshCw, HardDrive, ExternalLink } from 'lucide-vue-next'

const { t } = useI18n()

useSeoMeta({
  title: 'Download haex-vault - haex.space',
  description: 'Download haex-vault for Windows, macOS, Linux, Android, and iOS. Secure, encrypted storage for all your data.',
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
  'https://api.github.com/repos/haex-space/haex-vault/releases/latest',
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

const version = computed(() => release.value?.tag_name?.replace('v', '') || '...')

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

const desktopPlatforms = computed(() => [
  {
    id: 'windows',
    name: 'Windows',
    icon: 'mdi:microsoft-windows',
    requirements: 'Windows 10 or later',
    downloads: [
      { label: 'Windows Installer (.exe)', pattern: 'x64-setup.exe' },
      { label: 'Windows MSI (.msi)', pattern: 'x64_en-US.msi' },
    ],
  },
  {
    id: 'macos',
    name: 'macOS',
    icon: 'mdi:apple',
    requirements: 'macOS 11 or later',
    downloads: [
      { label: 'macOS Intel (.dmg)', pattern: 'x64.dmg' },
      { label: 'macOS Apple Silicon (.dmg)', pattern: 'aarch64.dmg' },
    ],
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: 'mdi:linux',
    requirements: 'Ubuntu 20.04, Fedora 34, or equivalent',
    downloads: [
      { label: 'AppImage (x64)', pattern: 'amd64.AppImage' },
      { label: 'Debian/Ubuntu (.deb)', pattern: 'amd64.deb' },
      { label: 'Fedora/RHEL (.rpm)', pattern: 'x86_64.rpm' },
    ],
  },
])

const mobilePlatforms = computed(() => [
  {
    id: 'android',
    name: 'Android',
    icon: 'mdi:android',
    requirements: 'Android 8.0 or later',
    downloads: [
      { label: 'APK (Universal)', pattern: 'app-universal-release.apk' },
    ],
    comingSoon: false,
  },
  {
    id: 'ios',
    name: 'iOS',
    icon: 'mdi:apple',
    requirements: 'iOS 14.0 or later',
    downloads: [],
    comingSoon: true,
  },
])

const features = computed(() => [
  {
    icon: Shield,
    title: t('download.features.encryption.title'),
    description: t('download.features.encryption.description'),
  },
  {
    icon: RefreshCw,
    title: t('download.features.sync.title'),
    description: t('download.features.sync.description'),
  },
  {
    icon: HardDrive,
    title: t('download.features.offline.title'),
    description: t('download.features.offline.description'),
  },
])
</script>

<template>
  <div>
    <!-- Hero -->
      <section class="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" class="mb-4">
          {{ t('download.badge') }}
        </Badge>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {{ t('download.title') }}
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
          {{ t('download.subtitle') }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ t('download.currentVersion') }}: <span class="font-mono">v{{ version }}</span>
          <a
            href="https://github.com/haex-space/haex-vault/releases"
            target="_blank"
            class="inline-flex items-center gap-1 ml-2 text-primary hover:underline"
          >
            {{ t('download.allReleases') }}
            <ExternalLink class="w-3 h-3" />
          </a>
        </p>
      </section>

      <!-- Desktop Downloads -->
      <section class="container mx-auto px-4 pb-12">
        <h2 class="text-2xl font-bold mb-6">{{ t('download.desktop') }}</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <Card v-for="platform in desktopPlatforms" :key="platform.id" class="relative overflow-hidden">
            <CardHeader>
              <div class="flex items-center gap-3 mb-2">
                <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon :name="platform.icon" class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{{ platform.name }}</CardTitle>
                  <p class="text-sm text-muted-foreground">v{{ version }}</p>
                </div>
              </div>
              <CardDescription>
                {{ platform.requirements }}
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <template v-if="pending">
                <div v-for="i in 2" :key="i" class="h-12 rounded-lg bg-muted animate-pulse" />
              </template>
              <a
                v-else
                v-for="download in platform.downloads"
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

      <!-- Mobile Downloads -->
      <section class="container mx-auto px-4 pb-16">
        <h2 class="text-2xl font-bold mb-6">{{ t('download.mobile') }}</h2>
        <div class="grid md:grid-cols-2 gap-6 max-w-2xl">
          <Card v-for="platform in mobilePlatforms" :key="platform.id" class="relative overflow-hidden">
            <CardHeader>
              <div class="flex items-center gap-3 mb-2">
                <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon :name="platform.icon" class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{{ platform.name }}</CardTitle>
                  <p class="text-sm text-muted-foreground">v{{ version }}</p>
                </div>
              </div>
              <CardDescription>
                {{ platform.requirements }}
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <template v-if="platform.comingSoon">
                <div class="p-3 rounded-lg border border-dashed border-border text-center">
                  <span class="text-sm text-muted-foreground">{{ t('download.comingSoon') }}</span>
                </div>
              </template>
              <template v-else-if="pending">
                <div class="h-12 rounded-lg bg-muted animate-pulse" />
              </template>
              <a
                v-else
                v-for="download in platform.downloads"
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

      <!-- Features -->
      <section class="bg-muted/50 py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl font-bold text-center mb-12">
            {{ t('download.whyVault') }}
          </h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div v-for="feature in features" :key="feature.title" class="text-center">
              <div class="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center mx-auto mb-4">
                <component :is="feature.icon" class="w-6 h-6 text-primary" />
              </div>
              <h3 class="font-semibold mb-2">{{ feature.title }}</h3>
              <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- System Requirements -->
      <section class="container mx-auto px-4 py-16">
        <h2 class="text-2xl font-bold text-center mb-8">
          {{ t('download.requirements.title') }}
        </h2>
        <div class="max-w-2xl mx-auto">
          <Card>
            <CardContent class="pt-6">
              <div class="space-y-4">
                <div class="flex justify-between py-2 border-b border-border">
                  <span class="font-medium">{{ t('download.requirements.desktop') }}</span>
                  <span class="text-muted-foreground text-sm">Windows 10+, macOS 11+, Linux (glibc 2.31+)</span>
                </div>
                <div class="flex justify-between py-2 border-b border-border">
                  <span class="font-medium">{{ t('download.requirements.mobile') }}</span>
                  <span class="text-muted-foreground text-sm">Android 8.0+, iOS 14.0+</span>
                </div>
                <div class="flex justify-between py-2 border-b border-border">
                  <span class="font-medium">{{ t('download.requirements.ram') }}</span>
                  <span class="text-muted-foreground text-sm">4 GB (8 GB {{ t('download.requirements.recommended') }})</span>
                </div>
                <div class="flex justify-between py-2 border-b border-border">
                  <span class="font-medium">{{ t('download.requirements.disk') }}</span>
                  <span class="text-muted-foreground text-sm">200 MB</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="font-medium">{{ t('download.requirements.arch') }}</span>
                  <span class="text-muted-foreground text-sm">x64, ARM64</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
  </div>
</template>
