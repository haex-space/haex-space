<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  features: Array<{
    icon: Component
    title: string
    description: string
  }>
}>()
</script>

<template>
  <div class="grid md:grid-cols-2 gap-4">
    <Card v-for="feature in features" :key="feature.title">
      <CardHeader class="pb-2">
        <CardTitle class="text-base flex items-center gap-2">
          <component :is="feature.icon" class="w-4 h-4" />
          {{ feature.title }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          {{ feature.description }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>
