<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

definePageMeta({
  middleware: 'developer-auth',
})

const route = useRoute()

// Check if we're on an auth page
const isAuthPage = computed(() => route.path.includes('/developer/auth'))
</script>

<template>
  <!-- Auth pages use their own layout -->
  <NuxtPage v-if="isAuthPage" />

  <!-- Other developer pages use default layout with custom header -->
  <ClientOnly v-else>
    <NuxtLayout name="default">
      <template #header-actions>
        <DeveloperHeaderActions />
      </template>
      <NuxtPage />
    </NuxtLayout>
    <template #fallback>
      <NuxtLayout name="default">
        <div class="container mx-auto px-4 py-8">
          <div class="flex items-center justify-center min-h-[50vh]">
            <Loader2 class="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </NuxtLayout>
    </template>
  </ClientOnly>
</template>
