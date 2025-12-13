<script setup lang="ts">
import { Star, User } from 'lucide-vue-next'
import type { ExtensionReview } from '~/stores/marketplace'

defineProps<{
  reviews: ExtensionReview[]
}>()

const { locale } = useI18n()

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="review in reviews"
      :key="review.id"
      class="border-b border-border pb-4 last:border-0"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User class="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <!-- Star Rating -->
              <div class="flex items-center">
                <Star
                  v-for="i in 5"
                  :key="i"
                  class="h-4 w-4"
                  :class="[
                    i <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/30'
                  ]"
                />
              </div>
            </div>
            <p class="text-xs text-muted-foreground">
              {{ formatDate(review.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Review Title -->
      <h4 v-if="review.title" class="font-medium mt-3">
        {{ review.title }}
      </h4>

      <!-- Review Content -->
      <p v-if="review.content" class="text-sm text-muted-foreground mt-2">
        {{ review.content }}
      </p>
    </div>
  </div>
</template>
