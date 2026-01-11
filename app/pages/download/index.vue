<script setup lang="ts">
import { Download, ExternalLink, FlaskConical } from 'lucide-vue-next'

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
  prerelease: boolean
  published_at: string
}

// Fetch latest stable release (via cached server API)
const { data: release, pending } = await useFetch<Release>('/api/releases/latest')

// Fetch latest nightly release
const nightlyRelease = ref<Release | null>(null)
const nightlyPending = ref(true)

onMounted(async () => {
  try {
    // Fetch all releases via cached server API
    const releases = await $fetch<Release[]>('/api/releases')
    const nightly = releases.find((r) => r.tag_name.startsWith('nightly-'))
    if (nightly) {
      nightlyRelease.value = nightly
    }
  } catch (e) {
    console.error('Failed to fetch nightly releases:', e)
  } finally {
    nightlyPending.value = false
  }
})

// Active tab (stable or nightly)
const activeTab = ref<'stable' | 'nightly'>('stable')

// Current release based on active tab
const currentRelease = computed(() =>
  activeTab.value === 'stable' ? release.value : nightlyRelease.value
)

const currentPending = computed(() =>
  activeTab.value === 'stable' ? pending.value : nightlyPending.value
)

const version = computed(() => {
  const tag = currentRelease.value?.tag_name
  if (!tag) return '...'
  if (tag.startsWith('nightly-')) {
    // Format: nightly-20260107-abc1234 -> 20260107-abc1234
    return tag.replace('nightly-', '')
  }
  return tag.replace('v', '')
})

const nightlyDate = computed(() => {
  if (!nightlyRelease.value?.published_at) return null
  return new Date(nightlyRelease.value.published_at).toLocaleDateString()
})

function getAssetUrl(pattern: string): string {
  if (!currentRelease.value?.assets) return '#'
  const asset = currentRelease.value.assets.find((a) => a.name.includes(pattern))
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
  if (!currentRelease.value?.assets) return ''
  const asset = currentRelease.value.assets.find((a) => a.name.includes(pattern))
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
      { label: 'APK (Universal)', pattern: '_universal.apk' },
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
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          {{ t('download.subtitle') }}
        </p>

        <!-- Version Tabs -->
        <div class="flex justify-center gap-2 mb-4">
          <Button
            :variant="activeTab === 'stable' ? 'default' : 'outline'"
            size="sm"
            @click="activeTab = 'stable'"
          >
            {{ t('download.stable') }}
          </Button>
          <Button
            :variant="activeTab === 'nightly' ? 'default' : 'outline'"
            size="sm"
            @click="activeTab = 'nightly'"
            :disabled="!nightlyRelease"
          >
            <FlaskConical class="w-4 h-4 mr-1" />
            {{ t('download.nightly') }}
          </Button>
        </div>

        <!-- Version info -->
        <p class="text-sm text-muted-foreground">
          <template v-if="activeTab === 'stable'">
            {{ t('download.currentVersion') }}: <span class="font-mono">v{{ version }}</span>
          </template>
          <template v-else>
            {{ t('download.nightlyVersion') }}: <span class="font-mono">{{ version }}</span>
            <span v-if="nightlyDate" class="ml-2 text-xs">({{ nightlyDate }})</span>
          </template>
          <a
            href="https://github.com/haex-space/haex-vault/releases"
            target="_blank"
            class="inline-flex items-center gap-1 ml-2 text-primary hover:underline"
          >
            {{ t('download.allReleases') }}
            <ExternalLink class="w-3 h-3" />
          </a>
        </p>

        <!-- Nightly warning -->
        <div v-if="activeTab === 'nightly'" class="mt-4 max-w-xl mx-auto">
          <div class="flex items-start gap-3 p-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 text-left">
            <FlaskConical class="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p class="font-medium text-yellow-600 dark:text-yellow-400">{{ t('download.nightlyWarning.title') }}</p>
              <p class="text-sm text-muted-foreground mt-1">{{ t('download.nightlyWarning.description') }}</p>
            </div>
          </div>
        </div>
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
                  <p class="text-sm text-muted-foreground">
                    <template v-if="activeTab === 'stable'">v{{ version }}</template>
                    <template v-else>{{ version }}</template>
                  </p>
                </div>
              </div>
              <CardDescription>
                {{ platform.requirements }}
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <template v-if="currentPending">
                <div v-for="i in 2" :key="i" class="h-12 rounded-lg bg-muted animate-pulse" />
              </template>
              <template v-else-if="!currentRelease">
                <div class="p-3 rounded-lg border border-dashed border-border text-center">
                  <span class="text-sm text-muted-foreground">{{ t('download.noRelease') }}</span>
                </div>
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
        <div class="grid md:grid-cols-2 gap-6 md:max-w-[calc(66.666%+0.75rem)] md:mx-auto">
          <Card v-for="platform in mobilePlatforms" :key="platform.id" class="relative overflow-hidden">
            <CardHeader>
              <div class="flex items-center gap-3 mb-2">
                <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon :name="platform.icon" class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{{ platform.name }}</CardTitle>
                  <p class="text-sm text-muted-foreground">
                    <template v-if="activeTab === 'stable'">v{{ version }}</template>
                    <template v-else>{{ version }}</template>
                  </p>
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
              <template v-else-if="currentPending">
                <div class="h-12 rounded-lg bg-muted animate-pulse" />
              </template>
              <template v-else-if="!currentRelease">
                <div class="p-3 rounded-lg border border-dashed border-border text-center">
                  <span class="text-sm text-muted-foreground">{{ t('download.noRelease') }}</span>
                </div>
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
