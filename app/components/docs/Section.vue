<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  id: string
  title: string
  icon?: Component
}>()
</script>

<template>
  <section :id="id" class="mb-16 scroll-mt-20">
    <h2 class="text-2xl font-bold mb-4 flex items-center gap-3">
      <component v-if="icon" :is="icon" class="w-6 h-6 text-primary" />
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
