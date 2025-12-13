<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  rating: number // Expected as 0-500 (stored format)
  count?: number
  href?: string
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}>(), {
  size: 'sm',
  showCount: true,
})

// Convert from stored format (0-500) to display format (0.0-5.0)
const displayRating = computed(() => (props.rating / 100).toFixed(1))

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'lg': return 'w-5 h-5'
    case 'md': return 'w-4 h-4'
    case 'sm':
    default: return 'w-4 h-4'
  }
})

const textClasses = computed(() => {
  switch (props.size) {
    case 'lg': return 'text-base'
    case 'md': return 'text-sm'
    case 'sm':
    default: return 'text-sm'
  }
})
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    :href="href"
    class="inline-flex items-center gap-1"
    :class="[
      textClasses,
      href ? 'hover:text-foreground transition-colors cursor-pointer' : ''
    ]"
  >
    <Star class="fill-yellow-400 text-yellow-400" :class="sizeClasses" />
    <span>{{ displayRating }}</span>
    <span v-if="showCount && count !== undefined">({{ count }})</span>
  </component>
</template>
