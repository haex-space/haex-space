<script setup lang="ts">
import { ArrowLeft, Download, Star, Calendar, User, ExternalLink, Puzzle } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()

const extensionSlug = computed(() => route.params.slug as string)

// TODO: Fetch from API
const extension = ref({
  slug: extensionSlug.value,
  name: 'Extension Name',
  shortDescription: 'A brief description of the extension.',
  description: 'Full description with markdown support will go here.',
  publisher: {
    slug: 'publisher',
    displayName: 'Publisher Name',
  },
  version: '1.0.0',
  downloads: 1250,
  rating: 4.8,
  reviewCount: 42,
  tags: ['productivity', 'tools'],
  createdAt: '2024-01-15',
  updatedAt: '2024-03-20',
})

useSeoMeta({
  title: () => `${extension.value.name} - haex.space Marketplace`,
  description: () => extension.value.shortDescription,
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Back Link -->
    <NuxtLinkLocale to="/marketplace" class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
      <ArrowLeft class="h-4 w-4" />
      {{ t('marketplace.title') }}
    </NuxtLinkLocale>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Header -->
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
            <Puzzle class="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 class="text-3xl font-bold">{{ extension.name }}</h1>
            <p class="text-muted-foreground mt-1">{{ extension.shortDescription }}</p>
            <div class="flex items-center gap-4 mt-3">
              <NuxtLinkLocale :to="`/publisher/${extension.publisher.slug}`" class="text-sm hover:text-primary transition-colors">
                {{ extension.publisher.displayName }}
              </NuxtLinkLocale>
              <div class="flex items-center gap-1 text-sm text-muted-foreground">
                <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {{ extension.rating }} ({{ extension.reviewCount }})
              </div>
              <div class="flex items-center gap-1 text-sm text-muted-foreground">
                <Download class="w-4 h-4" />
                {{ extension.downloads.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t('marketplace.extension.description') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">{{ extension.description }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Install Card -->
        <Card>
          <CardHeader>
            <CardTitle class="text-base">{{ t('marketplace.extension.install') }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button class="w-full" size="lg">
              <Download class="w-4 h-4 mr-2" />
              {{ t('marketplace.extension.installButton') }}
            </Button>
            <p class="text-xs text-muted-foreground text-center">
              {{ t('marketplace.extension.version') }}: {{ extension.version }}
            </p>
          </CardContent>
        </Card>

        <!-- Info Card -->
        <Card>
          <CardHeader>
            <CardTitle class="text-base">{{ t('marketplace.extension.info') }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground flex items-center gap-2">
                <User class="w-4 h-4" />
                {{ t('marketplace.extension.publisher') }}
              </span>
              <NuxtLinkLocale :to="`/publisher/${extension.publisher.slug}`" class="hover:text-primary transition-colors">
                {{ extension.publisher.displayName }}
              </NuxtLinkLocale>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground flex items-center gap-2">
                <Calendar class="w-4 h-4" />
                {{ t('marketplace.extension.updated') }}
              </span>
              <span>{{ new Date(extension.updatedAt).toLocaleDateString() }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground flex items-center gap-2">
                <Download class="w-4 h-4" />
                {{ t('marketplace.extension.downloads') }}
              </span>
              <span>{{ extension.downloads.toLocaleString() }}</span>
            </div>
          </CardContent>
        </Card>

        <!-- Tags -->
        <Card v-if="extension.tags.length > 0">
          <CardHeader>
            <CardTitle class="text-base">{{ t('marketplace.extension.tags') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <NuxtLinkLocale
                v-for="tag in extension.tags"
                :key="tag"
                :to="{ path: '/marketplace', query: { tag } }"
              >
                <Badge variant="secondary" class="cursor-pointer hover:bg-secondary/80">
                  {{ tag }}
                </Badge>
              </NuxtLinkLocale>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
