<script setup lang="ts">
import { Package, Plus, Search, Loader2 } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

definePageMeta({
  layout: false,
})

const { t } = useI18n()
const store = useMarketplaceStore()

useSeoMeta({
  title: 'Your Extensions - haex.space',
  description: 'Manage your extensions on the haex marketplace.',
})

// Fetch extensions on mount (middleware already ensures auth)
const loading = ref(true)
onMounted(async () => {
  await store.fetchMyExtensions()
  loading.value = false
})

// Search
const searchQuery = ref('')

const filteredExtensions = computed(() => {
  if (!searchQuery.value) return store.extensions

  const query = searchQuery.value.toLowerCase()
  return store.extensions.filter(ext =>
    ext.name.toLowerCase().includes(query) ||
    ext.shortDescription.toLowerCase().includes(query)
  )
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-[50vh]">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">{{ t('developer.extensions.title') }}</h1>
          <p class="text-muted-foreground mt-1">
            {{ t('developer.extensions.description') }}
          </p>
        </div>
        <NuxtLinkLocale to="/developer/extensions/new">
          <Button>
            <Plus class="h-4 w-4 mr-2" />
            {{ t('developer.extensions.create') }}
          </Button>
        </NuxtLinkLocale>
      </div>

      <!-- Search -->
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          :placeholder="t('developer.extensions.search')"
          class="pl-9"
        />
      </div>

      <!-- Extensions List -->
      <Card>
        <CardContent class="p-0">
          <!-- Empty State -->
          <div v-if="filteredExtensions.length === 0" class="text-center py-12">
            <Package class="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p class="mt-4 text-muted-foreground">{{ t('developer.extensions.empty') }}</p>
            <NuxtLinkLocale to="/developer/extensions/new" class="mt-4 inline-block">
              <Button variant="outline">
                <Plus class="h-4 w-4 mr-2" />
                {{ t('developer.extensions.create') }}
              </Button>
            </NuxtLinkLocale>
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b">
                <tr class="text-left text-sm text-muted-foreground">
                  <th class="p-4 font-medium">{{ t('developer.extensions.table.name') }}</th>
                  <th class="p-4 font-medium hidden md:table-cell">{{ t('developer.extensions.table.downloads') }}</th>
                  <th class="p-4 font-medium hidden lg:table-cell">{{ t('developer.extensions.table.updated') }}</th>
                  <th class="p-4 font-medium text-right">{{ t('developer.extensions.table.actions') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr v-for="extension in filteredExtensions" :key="extension.id" class="hover:bg-muted/50">
                  <td class="p-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <img
                          v-if="extension.iconUrl"
                          :src="extension.iconUrl"
                          :alt="extension.name"
                          class="w-8 h-8 rounded"
                        />
                        <Package v-else class="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div class="min-w-0">
                        <p class="font-medium truncate">{{ extension.name }}</p>
                        <p class="text-sm text-muted-foreground truncate">{{ extension.shortDescription }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-4 hidden md:table-cell">
                    {{ extension.totalDownloads.toLocaleString() }}
                  </td>
                  <td class="p-4 hidden lg:table-cell text-muted-foreground">
                    {{ formatDate(extension.updatedAt) }}
                  </td>
                  <td class="p-4 text-right">
                    <NuxtLinkLocale :to="`/developer/extensions/${extension.slug}`">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </NuxtLinkLocale>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
