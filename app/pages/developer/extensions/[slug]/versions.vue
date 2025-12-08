<script setup lang="ts">
import { ArrowLeft, Loader2, Package, Download, Calendar, FileArchive, History } from 'lucide-vue-next'
import { useMarketplaceStore, type PublisherExtension } from '~/stores/marketplace'
import type { ExtensionVersion } from '@haex-space/marketplace-sdk'

definePageMeta({
  layout: false,
})

const { t } = useI18n()
const route = useRoute()
const store = useMarketplaceStore()

const extensionSlug = computed(() => route.params.slug as string)

useSeoMeta({
  title: () => `${t('developer.extensions.versions.title')} - haex.space`,
  description: () => t('developer.extensions.versions.description'),
})

// Extension data
const extension = ref<PublisherExtension | null>(null)
const versions = ref<ExtensionVersion[]>([])
const loading = ref(true)
const notFound = ref(false)

// Load extension and versions
onMounted(async () => {
  try {
    // Fetch extension
    let found = store.extensions.find(e => e.slug === extensionSlug.value)
    if (!found) {
      await store.fetchMyExtensions()
      found = store.extensions.find(e => e.slug === extensionSlug.value)
    }

    if (found) {
      extension.value = found
      // Fetch versions from API
      versions.value = await store.listVersions(extensionSlug.value)
    } else {
      notFound.value = true
    }
  } finally {
    loading.value = false
  }
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function downloadVersion(version: string) {
  if (!extension.value) return
  const res = await store.getDownloadUrl(extension.value.slug, version)
  window.open(res.downloadUrl, '_blank')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-[50vh]">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <!-- Not found -->
    <div v-else-if="notFound" class="text-center py-12">
      <Package class="h-12 w-12 mx-auto text-muted-foreground/50" />
      <p class="mt-4 text-muted-foreground">{{ t('developer.extensions.versions.notFound') }}</p>
      <NuxtLinkLocale to="/developer/extensions" class="mt-4 inline-block">
        <Button variant="outline">{{ t('developer.extensions.versions.backToList') }}</Button>
      </NuxtLinkLocale>
    </div>

    <!-- Versions list -->
    <div v-else-if="extension" class="space-y-6">
      <!-- Back Link -->
      <NuxtLinkLocale :to="`/developer/extensions/${extension.slug}`" class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft class="h-4 w-4" />
        {{ extension.name }}
      </NuxtLinkLocale>

      <!-- Header -->
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <img
              v-if="extension.iconUrl"
              :src="extension.iconUrl"
              :alt="extension.name"
              class="w-10 h-10 rounded"
            />
            <History v-else class="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h1 class="text-2xl font-bold">{{ t('developer.extensions.versions.title') }}</h1>
            <p class="text-muted-foreground">{{ extension.name }}</p>
          </div>
        </div>
      </div>

      <!-- Versions Table -->
      <Card>
        <CardContent class="p-0">
          <!-- Empty State -->
          <div v-if="versions.length === 0" class="text-center py-12">
            <FileArchive class="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p class="mt-4 text-muted-foreground">{{ t('developer.extensions.versions.empty') }}</p>
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b">
                <tr class="text-left text-sm text-muted-foreground">
                  <th class="p-4 font-medium">{{ t('developer.extensions.versions.table.version') }}</th>
                  <th class="p-4 font-medium hidden md:table-cell">{{ t('developer.extensions.versions.table.size') }}</th>
                  <th class="p-4 font-medium hidden lg:table-cell">{{ t('developer.extensions.versions.table.published') }}</th>
                  <th class="p-4 font-medium text-right">{{ t('developer.extensions.versions.table.actions') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr
                  v-for="version in versions"
                  :key="version.id"
                  class="hover:bg-muted/50"
                  :class="{ 'bg-primary/5': version.version === extension.latestVersion }"
                >
                  <td class="p-4">
                    <div class="flex items-center gap-3">
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <p class="font-mono font-medium">v{{ version.version }}</p>
                          <Badge v-if="version.version === extension.latestVersion" variant="secondary" class="text-xs">
                            {{ t('developer.extensions.versions.latest') }}
                          </Badge>
                        </div>
                        <p v-if="version.changelog" class="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {{ version.changelog }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="p-4 hidden md:table-cell">
                    <span class="text-sm text-muted-foreground">
                      {{ formatFileSize(version.bundleSize) }}
                    </span>
                  </td>
                  <td class="p-4 hidden lg:table-cell">
                    <div v-if="version.publishedAt" class="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar class="h-4 w-4" />
                      {{ formatDate(version.publishedAt) }}
                    </div>
                    <span v-else class="text-sm text-muted-foreground">-</span>
                  </td>
                  <td class="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="downloadVersion(version.version)"
                    >
                      <Download class="h-4 w-4 mr-2" />
                      {{ t('developer.extensions.versions.download') }}
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Version Details Section (optional expansion) -->
      <div v-if="versions.length > 0" class="text-sm text-muted-foreground">
        {{ t('developer.extensions.versions.totalVersions', { count: versions.length }) }}
      </div>
    </div>
  </div>
</template>
