<script setup lang="ts">
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Upload, Package, ExternalLink } from 'lucide-vue-next'
import { useMarketplaceStore, type Extension } from '~/stores/marketplace'

definePageMeta({
  layout: false,
})

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const store = useMarketplaceStore()

const extensionSlug = computed(() => route.params.slug as string)

useSeoMeta({
  title: 'Edit Extension - haex.space',
  description: 'Edit your extension on the haex marketplace.',
})

// Extension data
const extension = ref<Extension | null>(null)
const loading = ref(true)
const notFound = ref(false)

// Form state
const form = reactive({
  name: '',
  shortDescription: '',
  description: '',
  tags: '',
})

// UI state
const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')
const uploadingIcon = ref(false)

// Load extension data
onMounted(async () => {
  try {
    await store.fetchMyExtensions()
    const found = store.extensions.find(e => e.slug === extensionSlug.value)
    if (found) {
      extension.value = found
      form.name = found.name
      form.shortDescription = found.shortDescription
      form.description = found.description || ''
      form.tags = found.tags?.join(', ') || ''
    } else {
      notFound.value = true
    }
  } finally {
    loading.value = false
  }
})

// Handle save
async function handleSave() {
  if (!extension.value || !form.name || !form.shortDescription) return

  saving.value = true
  saveSuccess.value = false
  saveError.value = ''

  try {
    const tags = form.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    await store.updateExtension(extension.value.slug, {
      name: form.name,
      shortDescription: form.shortDescription,
      description: form.description || undefined,
      tags,
    })

    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (err: unknown) {
    saveError.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    saving.value = false
  }
}

// Handle icon upload
async function handleIconUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !extension.value) return

  uploadingIcon.value = true
  try {
    const result = await store.uploadExtensionIcon(extension.value.slug, file)
    extension.value.iconUrl = result.iconUrl
  } catch (err) {
    console.error('Failed to upload icon:', err)
  } finally {
    uploadingIcon.value = false
    target.value = ''
  }
}

// Status helpers
function getStatusVariant(status: string) {
  switch (status) {
    case 'published': return 'default'
    case 'draft': return 'secondary'
    case 'pending_review': return 'outline'
    case 'rejected': return 'destructive'
    default: return 'secondary'
  }
}
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
      <NuxtLinkLocale to="/developer/extensions" class="mt-4 inline-block">
        <Button variant="outline">Back to Extensions</Button>
      </NuxtLinkLocale>
    </div>

    <!-- Edit form -->
    <div v-else-if="extension" class="max-w-4xl mx-auto space-y-6">
      <!-- Back Link -->
      <NuxtLinkLocale to="/developer/extensions" class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft class="h-4 w-4" />
        {{ t('developer.extensions.title') }}
      </NuxtLinkLocale>

      <!-- Header -->
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
            <img
              v-if="extension.iconUrl"
              :src="extension.iconUrl"
              :alt="extension.name"
              class="w-14 h-14 rounded"
            />
            <Package v-else class="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h1 class="text-3xl font-bold">{{ extension.name }}</h1>
            <div class="flex items-center gap-2 mt-1">
              <Badge :variant="getStatusVariant(extension.status)">
                {{ t(`developer.extensions.status.${extension.status}`) }}
              </Badge>
              <span class="text-sm text-muted-foreground">{{ extension.slug }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <NuxtLinkLocale :to="`/marketplace/${extension.slug}`" target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink class="h-4 w-4 mr-2" />
              {{ t('developer.extensions.edit.preview') }}
            </Button>
          </NuxtLinkLocale>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{{ t('developer.extensions.edit.title') }}</CardTitle>
            </CardHeader>
            <CardContent>
              <form @submit.prevent="handleSave" class="space-y-6">
                <!-- Name -->
                <div class="space-y-2">
                  <Label for="name">{{ t('developer.extensions.new.name') }}</Label>
                  <Input
                    id="name"
                    v-model="form.name"
                    :placeholder="t('developer.extensions.new.name')"
                    required
                  />
                </div>

                <!-- Short Description -->
                <div class="space-y-2">
                  <Label for="shortDescription">{{ t('developer.extensions.new.shortDescription') }}</Label>
                  <Input
                    id="shortDescription"
                    v-model="form.shortDescription"
                    :placeholder="t('developer.extensions.new.shortDescription')"
                    maxlength="150"
                    required
                  />
                </div>

                <!-- Description -->
                <div class="space-y-2">
                  <Label for="description">{{ t('developer.extensions.new.description') }}</Label>
                  <Textarea
                    id="description"
                    v-model="form.description"
                    :placeholder="t('developer.extensions.new.description')"
                    rows="8"
                  />
                </div>

                <!-- Tags -->
                <div class="space-y-2">
                  <Label for="tags">{{ t('developer.extensions.new.tags') }}</Label>
                  <Input
                    id="tags"
                    v-model="form.tags"
                    placeholder="productivity, notes, sync"
                  />
                </div>

                <!-- Success/Error messages -->
                <div v-if="saveSuccess" class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle class="h-4 w-4" />
                  {{ t('developer.extensions.edit.saved') }}
                </div>
                <div v-if="saveError" class="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle class="h-4 w-4" />
                  {{ saveError }}
                </div>

                <!-- Submit -->
                <Button type="submit" :disabled="saving || !form.name || !form.shortDescription">
                  <Loader2 v-if="saving" class="h-4 w-4 mr-2 animate-spin" />
                  {{ saving ? t('developer.extensions.edit.saving') : t('developer.extensions.edit.save') }}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Icon Upload -->
          <Card>
            <CardHeader>
              <CardTitle class="text-base">{{ t('developer.extensions.edit.icon') }}</CardTitle>
              <CardDescription>{{ t('developer.extensions.edit.iconDescription') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex flex-col items-center gap-4">
                <div class="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                  <img
                    v-if="extension.iconUrl"
                    :src="extension.iconUrl"
                    :alt="extension.name"
                    class="w-20 h-20 rounded"
                  />
                  <Package v-else class="h-10 w-10 text-muted-foreground" />
                </div>
                <label class="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleIconUpload"
                  />
                  <Button as="span" variant="outline" size="sm" :disabled="uploadingIcon">
                    <Loader2 v-if="uploadingIcon" class="h-4 w-4 mr-2 animate-spin" />
                    <Upload v-else class="h-4 w-4 mr-2" />
                    {{ t('developer.extensions.edit.changeIcon') }}
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          <!-- Stats -->
          <Card>
            <CardHeader>
              <CardTitle class="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Downloads</span>
                <span class="font-medium">{{ extension.totalDownloads.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Rating</span>
                <span class="font-medium">
                  {{ extension.averageRating > 0 ? extension.averageRating.toFixed(1) : '-' }}
                  <span v-if="extension.reviewCount > 0" class="text-muted-foreground text-sm">
                    ({{ extension.reviewCount }})
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
