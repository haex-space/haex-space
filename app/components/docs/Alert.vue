<script setup lang="ts">
defineProps<{
  type: 'info' | 'warning' | 'danger'
  title?: string
}>()

const typeClasses = {
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
  danger: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
}
</script>

<template>
  <div :class="['rounded-lg border p-4', typeClasses[type]]">
    <p class="text-sm">
      <strong v-if="title">{{ title }}:</strong>
      <slot />
    </p>
  </div>
</template>
