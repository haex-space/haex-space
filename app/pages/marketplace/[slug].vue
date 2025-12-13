<script setup lang="ts">
import { ArrowLeft, Download, Star, Calendar, Pencil, Puzzle, Loader2, Package, Tag, MessageSquare } from 'lucide-vue-next'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { useMarketplaceStore, type ExtensionDetail, type PublisherExtension, type ExtensionReview } from '~/stores/marketplace'

const { t } = useI18n()
const route = useRoute()
const store = useMarketplaceStore()
const colorMode = useColorMode()

// Editor theme based on color mode
const previewTheme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')

const extensionSlug = computed(() => route.params.slug as string)

// State - can be either ExtensionDetail (from public API) or PublisherExtension (from owner's list)
const extension = ref<ExtensionDetail | PublisherExtension | null>(null)
const loading = ref(true)
const notFound = ref(false)

// Check if this is a publisher extension (for owner-specific functionality)
const isPublisherExtension = computed(() => {
  return extension.value && 'publisherId' in extension.value
})

// Check if current user owns this extension
const isOwner = computed(() => {
  if (!store.user || !store.publisher || !extension.value) return false
  if (isPublisherExtension.value) {
    return (extension.value as PublisherExtension).publisherId === store.publisher.id
  }
  // For ExtensionDetail, check via publisher slug
  const ext = extension.value as ExtensionDetail
  return ext.publisher?.slug === store.publisher.slug
})

// Reviews state
const reviews = ref<ExtensionReview[]>([])
const myReview = ref<ExtensionReview | null>(null)
const loadingReviews = ref(false)
const showReviewForm = ref(false)

// Load reviews
async function loadReviews() {
  if (!extension.value) return

  loadingReviews.value = true
  try {
    const response = await store.listReviews(extensionSlug.value)
    reviews.value = response.reviews

    // Load user's own review if logged in
    if (store.user) {
      myReview.value = await store.getMyReview(extensionSlug.value)
    }
  } catch (e) {
    console.error('Failed to load reviews:', e)
  } finally {
    loadingReviews.value = false
  }
}

// Handle review submission
function handleReviewSubmitted(review: ExtensionReview) {
  myReview.value = review
  showReviewForm.value = false
  // Refresh reviews list and extension data
  loadReviews()
  // Refresh extension to get updated rating
  store.fetchExtension(extensionSlug.value).then(ext => {
    extension.value = ext
  })
}

// Handle review deletion
function handleReviewDeleted() {
  myReview.value = null
  showReviewForm.value = false
  loadReviews()
  // Refresh extension to get updated rating
  store.fetchExtension(extensionSlug.value).then(ext => {
    extension.value = ext
  })
}

// Load extension and publisher info
onMounted(async () => {
  try {
    // Initialize store if not yet done
    if (!store.initialized) {
      await store.init()
    }

    // Load publisher info if logged in (for owner check)
    if (store.user && !store.publisher) {
      try {
        await store.fetchPublisher()
      } catch {
        // Ignore - user might not have a publisher profile
      }
    }

    // First check if extension is already in store (for preview during editing)
    // This preserves unsaved changes from the edit page
    const ownExtension = store.extensions.find(e => e.slug === extensionSlug.value)
    if (ownExtension) {
      extension.value = ownExtension
    } else if (store.user) {
      // If logged in but extension not in store, try to load user's extensions
      try {
        await store.fetchMyExtensions()
        const found = store.extensions.find(e => e.slug === extensionSlug.value)
        if (found) {
          extension.value = found
        }
      } catch {
        // Ignore
      }
    }

    // If still not found, fetch from public API
    if (!extension.value) {
      const ext = await store.fetchExtension(extensionSlug.value)
      extension.value = ext
    }

    // Load reviews after extension is loaded
    await loadReviews()
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
})

useSeoMeta({
  title: () => extension.value ? `${extension.value.name} - haex.space Marketplace` : 'Marketplace - haex.space',
  description: () => extension.value?.shortDescription || '',
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-[50vh]">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <!-- Not found -->
    <div v-else-if="notFound" class="text-center py-12">
      <Package class="h-12 w-12 mx-auto text-muted-foreground/50" />
      <p class="mt-4 text-muted-foreground">Extension not found.</p>
      <NuxtLinkLocale to="/marketplace" class="mt-4 inline-block">
        <Button variant="outline">Back to Marketplace</Button>
      </NuxtLinkLocale>
    </div>

    <!-- Extension details -->
    <div v-else-if="extension">
      <!-- Breadcrumbs -->
      <div class="mb-6">
        <NuxtLinkLocale to="/marketplace" class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft class="h-4 w-4" />
          {{ t('marketplace.title') }}
        </NuxtLinkLocale>
      </div>

      <!-- Header -->
      <div class="flex items-start justify-between gap-4 mb-8">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <img
              v-if="extension.iconUrl"
              :src="extension.iconUrl"
              :alt="extension.name"
              class="w-14 h-14 rounded object-contain"
            />
            <Puzzle v-else class="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h1 class="text-3xl font-bold">{{ extension.name }}</h1>
            <p class="text-muted-foreground mt-1">{{ extension.shortDescription }}</p>
            <div class="flex items-center gap-4 mt-3">
              <div v-if="extension.averageRating && extension.averageRating > 0" class="flex items-center gap-1 text-sm text-muted-foreground">
                <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {{ (extension.averageRating / 100).toFixed(1) }} ({{ extension.reviewCount }})
              </div>
              <div class="flex items-center gap-1 text-sm text-muted-foreground">
                <Download class="w-4 h-4" />
                {{ extension.totalDownloads.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
        <NuxtLinkLocale v-if="isOwner" :to="`/developer/extensions/${extension.slug}`">
          <Button variant="outline" size="sm">
            <Pencil class="h-4 w-4 mr-2" />
            {{ t('marketplace.extension.edit') }}
          </Button>
        </NuxtLinkLocale>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Description -->
          <Card>
            <CardHeader>
              <CardTitle>{{ t('marketplace.extension.description') }}</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientOnly>
                <MdPreview
                  :model-value="extension.description || extension.shortDescription"
                  :theme="previewTheme"
                  preview-theme="default"
                  class="markdown-preview"
                />
              </ClientOnly>
            </CardContent>
          </Card>

          <!-- Reviews Section -->
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                  <MessageSquare class="h-5 w-5" />
                  {{ t('marketplace.reviews.title') }}
                  <span v-if="extension.reviewCount > 0" class="text-muted-foreground font-normal text-base">
                    ({{ extension.reviewCount }})
                  </span>
                </CardTitle>
                <!-- Write review button (only for logged-in users who haven't reviewed yet and don't own the extension) -->
                <Button
                  v-if="store.user && !myReview && !isOwner"
                  size="sm"
                  @click="showReviewForm = !showReviewForm"
                >
                  {{ t('marketplace.reviews.writeReview') }}
                </Button>
              </div>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Login prompt for non-logged-in users -->
              <div v-if="!store.user" class="text-center py-4 text-muted-foreground">
                <p>{{ t('marketplace.reviews.loginToReview') }}</p>
                <NuxtLinkLocale to="/auth/login?tab=marketplace" class="text-primary hover:underline">
                  {{ t('marketplace.reviews.loginLink') }}
                </NuxtLinkLocale>
              </div>

              <!-- Owner notice -->
              <p v-else-if="isOwner" class="text-sm text-muted-foreground">
                {{ t('marketplace.reviews.ownerNotice') }}
              </p>

              <!-- Review form (for new review) -->
              <div v-else-if="showReviewForm && !myReview" class="border-b border-border pb-6">
                <h4 class="font-medium mb-4">{{ t('marketplace.reviews.writeReview') }}</h4>
                <MarketplaceReviewForm
                  :extension-slug="extensionSlug"
                  @submitted="handleReviewSubmitted"
                  @deleted="handleReviewDeleted"
                />
              </div>

              <!-- User's existing review (editable) -->
              <div v-if="myReview" class="border-b border-border pb-6">
                <h4 class="font-medium mb-4">{{ t('marketplace.reviews.yourReview') }}</h4>
                <MarketplaceReviewForm
                  :extension-slug="extensionSlug"
                  :existing-review="myReview"
                  @submitted="handleReviewSubmitted"
                  @deleted="handleReviewDeleted"
                />
              </div>

              <!-- Loading state -->
              <div v-if="loadingReviews" class="flex justify-center py-4">
                <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
              </div>

              <!-- Reviews list -->
              <div v-else-if="reviews.length > 0">
                <MarketplaceReviewList :reviews="reviews.filter(r => r.id !== myReview?.id)" />
              </div>

              <!-- No reviews yet -->
              <p v-else-if="!myReview" class="text-center py-4 text-muted-foreground">
                {{ t('marketplace.reviews.noReviews') }}
              </p>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Info Card -->
          <Card>
            <CardHeader>
              <CardTitle class="text-base">{{ t('marketplace.extension.info') }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground flex items-center gap-2">
                  <Star class="w-4 h-4" />
                  {{ t('marketplace.extension.rating') }}
                </span>
                <span v-if="extension.averageRating && extension.averageRating > 0" class="flex items-center gap-1">
                  <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {{ (extension.averageRating / 100).toFixed(1) }} ({{ extension.reviewCount }})
                </span>
                <span v-else>-</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground flex items-center gap-2">
                  <Calendar class="w-4 h-4" />
                  {{ t('marketplace.extension.updated') }}
                </span>
                <span>{{ new Date(extension.updatedAt).toLocaleDateString() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground flex items-center gap-2">
                  <Download class="w-4 h-4" />
                  {{ t('marketplace.extension.downloads') }}
                </span>
                <span>{{ extension.totalDownloads.toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground flex items-center gap-2">
                  <Tag class="w-4 h-4" />
                  {{ t('marketplace.extension.version') }}
                </span>
                <span class="font-mono">{{ 'latestVersion' in extension && extension.latestVersion ? (typeof extension.latestVersion === 'string' ? extension.latestVersion : extension.latestVersion.version) : '-' }}</span>
              </div>
            </CardContent>
          </Card>

          <!-- Tags -->
          <Card v-if="extension.tags && extension.tags.length > 0">
            <CardHeader>
              <CardTitle class="text-base">{{ t('marketplace.extension.tags') }}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-2">
                <NuxtLinkLocale
                  v-for="tag in extension.tags"
                  :key="tag"
                  :to="{ path: '/marketplace', query: { tag } }"
                >
                  <Badge variant="secondary" class="cursor-pointer hover:bg-secondary/80">
                    {{ tag }}
                  </Badge>
                </NuxtLinkLocale>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
