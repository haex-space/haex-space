<script setup lang="ts">
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
  <NuxtLayout v-else name="default">
    <template #header-actions>
      <DeveloperHeaderActions />
    </template>
    <NuxtPage />
  </NuxtLayout>
</template>
