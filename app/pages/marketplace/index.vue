<script setup lang="ts">
import { Puzzle, Download, Star, Code, Loader2, Package, Tag } from 'lucide-vue-next'
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
          <div v-else class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <NuxtLinkLocale
              v-for="ext in extensions"
              :key="ext.slug"
              :to="`/marketplace/${ext.slug}`"
              class="group"
            >
              <Card class="h-full transition-all hover:border-primary/50 hover:shadow-lg">
                <CardHeader class="pb-4">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <img
                      v-if="ext.iconUrl"
                      :src="ext.iconUrl"
                      :alt="ext.name"
                      class="w-14 h-14 rounded-lg object-contain"
                    />
                    <Puzzle v-else class="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle class="text-lg group-hover:text-primary transition-colors">
                    {{ ext.name }}
                  </CardTitle>
                  <CardDescription class="line-clamp-2 min-h-10">
                    {{ ext.shortDescription }}
                  </CardDescription>
                </CardHeader>
                <CardContent class="pt-0">
                  <div class="flex flex-col gap-3 text-sm text-muted-foreground">
                    <span>{{ t('marketplace.by') }} {{ ext.publisher?.displayName || 'Unknown' }}</span>
                    <div class="grid grid-cols-3 gap-2">
                      <div class="flex items-center justify-center gap-1.5">
                        <Download class="w-4 h-4 shrink-0" />
                        <span>{{ ext.totalDownloads.toLocaleString() }}</span>
                      </div>
                      <div class="flex items-center justify-center gap-1.5">
                        <Star class="w-4 h-4 shrink-0" :class="ext.averageRating ? 'fill-yellow-400 text-yellow-400' : ''" />
                        <span>{{ ext.averageRating ? ext.averageRating.toFixed(1) : '-' }}</span>
                      </div>
                      <div class="flex items-center justify-center gap-1.5">
                        <Tag class="w-4 h-4 shrink-0" />
                        <span class="font-mono text-xs">{{ ext.versions?.[0]?.version || '-' }}</span>
                      </div>
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
