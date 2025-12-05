<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  description: string
  icon: Component
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <component :is="icon" class="w-6 h-6 text-primary" />
      </div>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>
  </Card>
</template>
