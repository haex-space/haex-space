<script setup lang="ts">
defineProps<{
  number: number
  title: string
}>()
</script>

<template>
  <div>
    <h3 class="font-semibold mb-3 flex items-center gap-2">
      <span class="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
        {{ number }}
      </span>
      {{ title }}
    </h3>
    <slot />
  </div>
</template>
