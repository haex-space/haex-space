<script setup lang="ts">
import { useMarketplaceStore } from '~/stores/marketplace'

const route = useRoute()
const store = useMarketplaceStore()

// Check if we're on an auth page
const isAuthPage = computed(() => route.path.includes('/developer/auth'))

// Initialize store once for all developer pages
onMounted(() => {
  store.init()
})
</script>

<template>
  <!-- Auth pages use their own layout -->
  <NuxtPage v-if="isAuthPage" />

  <!-- Other developer pages use default layout with custom header -->
  <NuxtLayout v-else name="default">
    <template #header-actions>
      <DeveloperHeaderActions />
    </template>
    <NuxtPage />
  </NuxtLayout>
</template>
