<script setup lang="ts">
import { Puzzle, Download, Star, Code, Loader2, Package } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

const { t } = useI18n()
const store = useMarketplaceStore()

useSeoMeta({
  title: 'Extension Marketplace - haex.space',
  description: 'Discover and install extensions to enhance your haex.space experience.',
})

const loading = ref(true)
const extensions = ref<Awaited<ReturnType<typeof store.fetchPublicExtensions>>['extensions']>([])

onMounted(async () => {
  try {
    await store.fetchCategories()
    const result = await store.fetchPublicExtensions({ limit: 12 })
    extensions.value = result.extensions
  } catch (error) {
    console.error('Failed to load marketplace data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <!-- Hero -->
      <section class="container mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">
          {{ t('marketplace.title') }}
        </h1>
        <p class="text-muted-foreground text-lg max-w-2xl">
          {{ t('marketplace.subtitle') }}
        </p>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="container mx-auto px-4 py-12 flex items-center justify-center min-h-[40vh]">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>

      <template v-else>
        <!-- Categories -->
        <section v-if="store.categories.length > 0" class="container mx-auto px-4 pb-12">
          <h2 class="text-xl font-semibold mb-6">{{ t('marketplace.categories') }}</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NuxtLinkLocale
              v-for="category in store.categories"
              :key="category.slug"
              :to="{ path: '/marketplace', query: { category: category.slug } }"
              class="group"
            >
              <Card class="transition-colors hover:border-primary/50">
                <CardHeader class="pb-3">
                  <CardTitle class="text-base">{{ category.name }}</CardTitle>
                </CardHeader>
              </Card>
            </NuxtLinkLocale>
          </div>
        </section>

        <Separator v-if="store.categories.length > 0" class="container mx-auto" />

        <!-- Extensions -->
        <section class="container mx-auto px-4 py-12">
          <h2 class="text-xl font-semibold mb-6">{{ t('marketplace.featured') }}</h2>

          <!-- Empty State -->
          <div v-if="extensions.length === 0" class="text-center py-12">
            <Package class="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p class="mt-4 text-muted-foreground">{{ t('marketplace.empty') }}</p>
          </div>

          <!-- Extensions Grid -->
          <div v-else class="grid md:grid-cols-3 gap-6">
            <NuxtLinkLocale
              v-for="ext in extensions"
              :key="ext.slug"
              :to="`/marketplace/${ext.slug}`"
              class="group"
            >
              <Card class="h-full transition-all hover:border-primary/50 hover:shadow-lg">
                <CardHeader>
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                    <img
                      v-if="ext.iconUrl"
                      :src="ext.iconUrl"
                      :alt="ext.name"
                      class="w-10 h-10 rounded"
                    />
                    <Puzzle v-else class="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle class="group-hover:text-primary transition-colors">
                    {{ ext.name }}
                  </CardTitle>
                  <CardDescription>
                    {{ ext.shortDescription }}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{{ t('marketplace.by') }} {{ ext.publisher?.displayName || 'Unknown' }}</span>
                    <div class="flex items-center gap-3">
                      <span class="flex items-center gap-1">
                        <Download class="w-4 h-4" />
                        {{ ext.totalDownloads.toLocaleString() }}
                      </span>
                      <span v-if="ext.reviewCount > 0 && ext.averageRating" class="flex items-center gap-1">
                        <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {{ ext.averageRating.toFixed(1) }}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </NuxtLinkLocale>
          </div>
        </section>
      </template>

      <!-- Publish CTA -->
      <section class="bg-muted/50 py-16">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-2xl font-bold mb-4">
            {{ t('marketplace.publishCta.title') }}
          </h2>
          <p class="text-muted-foreground max-w-xl mx-auto mb-8">
            {{ t('marketplace.publishCta.description') }}
          </p>
          <Button as-child size="lg" variant="secondary" class="gap-2">
            <NuxtLinkLocale to="/developer">
              <Code class="w-5 h-5" />
              {{ t('marketplace.publishCta.button') }}
            </NuxtLinkLocale>
          </Button>
        </div>
      </section>
  </div>
</template>
