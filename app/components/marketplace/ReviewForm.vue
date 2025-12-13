<script setup lang="ts">
import { Star, Loader2 } from 'lucide-vue-next'
import type { ExtensionReview } from '~/stores/marketplace'

const props = defineProps<{
  extensionSlug: string
  existingReview?: ExtensionReview | null
}>()

const emit = defineEmits<{
  submitted: [review: ExtensionReview]
  deleted: []
}>()

const { t } = useI18n()
const store = useMarketplaceStore()

const rating = ref(props.existingReview?.rating ?? 0)
const title = ref(props.existingReview?.title ?? '')
const content = ref(props.existingReview?.content ?? '')
const hoverRating = ref(0)
const submitting = ref(false)
const deleting = ref(false)
const error = ref('')

const isEditing = computed(() => !!props.existingReview)

// Update form when existingReview changes
watch(() => props.existingReview, (review) => {
  if (review) {
    rating.value = review.rating
    title.value = review.title ?? ''
    content.value = review.content ?? ''
  }
}, { immediate: true })

async function handleSubmit() {
  // Frontend validation (backend also validates with zod: min 1, max 5)
  if (rating.value < 1 || rating.value > 5) {
    error.value = t('marketplace.reviews.errors.ratingRequired')
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const data = {
      rating: Math.min(5, Math.max(1, Math.round(rating.value))), // Ensure integer 1-5
      title: title.value.slice(0, 100) || undefined,
      content: content.value.slice(0, 2000) || undefined,
    }

    let review: ExtensionReview
    if (isEditing.value) {
      review = await store.updateReview(props.extensionSlug, data)
    } else {
      review = await store.createReview(props.extensionSlug, data)
    }

    emit('submitted', review)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : t('marketplace.reviews.errors.submitFailed')
  } finally {
    submitting.value = false
  }
}

async function handleDelete() {
  if (!confirm(t('marketplace.reviews.confirmDelete'))) return

  deleting.value = true
  error.value = ''

  try {
    await store.deleteReview(props.extensionSlug)
    rating.value = 0
    title.value = ''
    content.value = ''
    emit('deleted')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : t('marketplace.reviews.errors.deleteFailed')
  } finally {
    deleting.value = false
  }
}

function setRating(value: number) {
  // Ensure rating is between 1 and 5
  rating.value = Math.min(5, Math.max(1, value))
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- Star Rating -->
    <div class="space-y-2">
      <Label>{{ t('marketplace.reviews.rating') }} *</Label>
      <div class="flex items-center gap-1">
        <button
          v-for="i in 5"
          :key="i"
          type="button"
          class="p-0.5 transition-transform hover:scale-110 focus:outline-none"
          @click="setRating(i)"
          @mouseenter="hoverRating = i"
          @mouseleave="hoverRating = 0"
        >
          <Star
            class="h-6 w-6 transition-colors"
            :class="[
              (hoverRating || rating) >= i
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            ]"
          />
        </button>
        <span v-if="rating > 0" class="ml-2 text-sm text-muted-foreground">
          {{ rating }}/5
        </span>
      </div>
    </div>

    <!-- Title (optional) -->
    <div class="space-y-2">
      <Label for="review-title">{{ t('marketplace.reviews.reviewTitle') }}</Label>
      <Input
        id="review-title"
        v-model="title"
        :placeholder="t('marketplace.reviews.titlePlaceholder')"
        :disabled="submitting"
        maxlength="100"
      />
    </div>

    <!-- Content (optional) -->
    <div class="space-y-2">
      <Label for="review-content">{{ t('marketplace.reviews.content') }}</Label>
      <Textarea
        id="review-content"
        v-model="content"
        :placeholder="t('marketplace.reviews.contentPlaceholder')"
        :disabled="submitting"
        rows="4"
        maxlength="2000"
      />
    </div>

    <!-- Error -->
    <p v-if="error" class="text-sm text-destructive">
      {{ error }}
    </p>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <Button type="submit" :disabled="submitting || deleting || rating < 1">
        <Loader2 v-if="submitting" class="h-4 w-4 mr-2 animate-spin" />
        {{ isEditing ? t('marketplace.reviews.update') : t('marketplace.reviews.submit') }}
      </Button>
      <Button
        v-if="isEditing"
        type="button"
        variant="destructive"
        :disabled="submitting || deleting"
        @click="handleDelete"
      >
        <Loader2 v-if="deleting" class="h-4 w-4 mr-2 animate-spin" />
        {{ t('marketplace.reviews.delete') }}
      </Button>
    </div>
  </form>
</template>
