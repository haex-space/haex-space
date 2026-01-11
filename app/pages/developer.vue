<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

definePageMeta({
  middleware: 'developer-auth',
})
</script>

<template>
  <ClientOnly>
    <NuxtPage />
    <template #fallback>
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-center min-h-[50vh]">
          <Loader2 class="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    </template>
  </ClientOnly>
</template>
