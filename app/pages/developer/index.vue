<script setup lang="ts">
import { Package, Download, Star, Plus, BookOpen, Store, AlertCircle, Loader2 } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

definePageMeta({
  layout: false, // Layout handled by parent developer.vue
})

const { t } = useI18n()
const store = useMarketplaceStore()

useSeoMeta({
  title: 'Developer Dashboard - haex.space',
  description: 'Manage your extensions on the haex marketplace.',
})

// Fetch extensions on mount (middleware already ensures auth)
onMounted(async () => {
  if (store.hasPublisher) {
    await store.fetchMyExtensions()
  }
})

// Calculate stats
const totalDownloads = computed(() => {
  return store.extensions.reduce((sum, ext) => sum + ext.totalDownloads, 0)
})

const averageRating = computed(() => {
  const rated = store.extensions.filter(ext => ext.reviewCount > 0)
  if (rated.length === 0) return 0
  const sum = rated.reduce((acc, ext) => acc + ext.averageRating, 0)
  return (sum / rated.length).toFixed(1)
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="store.loading" class="flex items-center justify-center min-h-[50vh]">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <div v-else class="space-y-8">
      <!-- Header -->
      <div>
      <h1 class="text-3xl font-bold">{{ t('developer.dashboard.title') }}</h1>
      <p class="text-muted-foreground mt-1">
        {{ t('developer.dashboard.welcome') }}, {{ store.user?.email }}
      </p>
    </div>

    <!-- Publisher Setup CTA (if no publisher profile) -->
    <Card v-if="!store.hasPublisher" class="border-primary/50 bg-primary/5">
      <CardContent class="pt-6">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-full bg-primary/10">
            <AlertCircle class="h-6 w-6 text-primary" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-lg">{{ t('developer.dashboard.setupPublisher.title') }}</h3>
            <p class="text-muted-foreground mt-1">
              {{ t('developer.dashboard.setupPublisher.description') }}
            </p>
            <NuxtLinkLocale to="/developer/settings" class="mt-4 inline-block">
              <Button>{{ t('developer.dashboard.setupPublisher.cta') }}</Button>
            </NuxtLinkLocale>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Stats -->
    <div v-if="store.hasPublisher" class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">{{ t('developer.dashboard.stats.totalExtensions') }}</CardTitle>
          <Package class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ store.extensions.length }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">{{ t('developer.dashboard.stats.totalDownloads') }}</CardTitle>
          <Download class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ totalDownloads.toLocaleString() }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">{{ t('developer.dashboard.stats.averageRating') }}</CardTitle>
          <Star class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ averageRating || '-' }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- Extensions List -->
    <Card v-if="store.hasPublisher">
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{{ t('developer.dashboard.extensions.title') }}</CardTitle>
        </div>
        <NuxtLinkLocale to="/developer/extensions/new">
          <Button size="sm">
            <Plus class="h-4 w-4 mr-2" />
            {{ t('developer.dashboard.extensions.create') }}
          </Button>
        </NuxtLinkLocale>
      </CardHeader>
      <CardContent>
        <!-- Empty State -->
        <div v-if="store.extensions.length === 0" class="text-center py-12">
          <Package class="h-12 w-12 mx-auto text-muted-foreground/50" />
          <p class="mt-4 text-muted-foreground">{{ t('developer.dashboard.extensions.empty') }}</p>
          <NuxtLinkLocale to="/developer/extensions/new" class="mt-4 inline-block">
            <Button variant="outline">
              <Plus class="h-4 w-4 mr-2" />
              {{ t('developer.dashboard.extensions.create') }}
            </Button>
          </NuxtLinkLocale>
        </div>

        <!-- Extensions Table -->
        <div v-else class="space-y-4">
          <div
            v-for="extension in store.extensions.slice(0, 5)"
            :key="extension.id"
            class="flex items-center justify-between p-4 rounded-lg border"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <img
                  v-if="extension.iconUrl"
                  :src="extension.iconUrl"
                  :alt="extension.name"
                  class="w-10 h-10 rounded"
                />
                <Package v-else class="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h4 class="font-medium">{{ extension.name }}</h4>
                <p class="text-sm text-muted-foreground">{{ extension.shortDescription }}</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-medium">{{ extension.totalDownloads.toLocaleString() }}</p>
                <p class="text-xs text-muted-foreground">Downloads</p>
              </div>
              <Badge :variant="extension.status === 'published' ? 'default' : 'secondary'">
                {{ extension.status }}
              </Badge>
              <NuxtLinkLocale :to="`/developer/extensions/${extension.slug}`">
                <Button variant="ghost" size="sm">Edit</Button>
              </NuxtLinkLocale>
            </div>
          </div>

          <!-- View All Link -->
          <div v-if="store.extensions.length > 5" class="text-center pt-4">
            <NuxtLinkLocale to="/developer/extensions">
              <Button variant="link">{{ t('developer.dashboard.extensions.viewAll') }}</Button>
            </NuxtLinkLocale>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Quick Actions -->
    <div class="grid gap-4 md:grid-cols-3">
      <NuxtLinkLocale v-if="store.hasPublisher" to="/developer/extensions/new" class="group">
        <Card class="h-full transition-colors hover:border-primary/50">
          <CardContent class="pt-6 flex items-center gap-4">
            <div class="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Plus class="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 class="font-medium">{{ t('developer.dashboard.quickActions.newExtension') }}</h3>
            </div>
          </CardContent>
        </Card>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/docs/extensions" class="group">
        <Card class="h-full transition-colors hover:border-primary/50">
          <CardContent class="pt-6 flex items-center gap-4">
            <div class="p-3 rounded-full bg-muted group-hover:bg-muted/80 transition-colors">
              <BookOpen class="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 class="font-medium">{{ t('developer.dashboard.quickActions.documentation') }}</h3>
            </div>
          </CardContent>
        </Card>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/marketplace" class="group">
        <Card class="h-full transition-colors hover:border-primary/50">
          <CardContent class="pt-6 flex items-center gap-4">
            <div class="p-3 rounded-full bg-muted group-hover:bg-muted/80 transition-colors">
              <Store class="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 class="font-medium">{{ t('developer.dashboard.quickActions.marketplace') }}</h3>
            </div>
          </CardContent>
        </Card>
      </NuxtLinkLocale>
    </div>
    </div>
  </div>
</template>
