<script setup lang="ts">
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Package, ExternalLink } from 'lucide-vue-next'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useMarketplaceStore, type Extension } from '~/stores/marketplace'

definePageMeta({
  layout: false,
})

const { t, locale } = useI18n()
const route = useRoute()
const store = useMarketplaceStore()
const colorMode = useColorMode()

const extensionSlug = computed(() => route.params.slug as string)

useSeoMeta({
  title: 'Edit Extension - haex.space',
  description: 'Edit your extension on the haex marketplace.',
})

// Extension data
const extension = ref<Extension | null>(null)
const loading = ref(true)
const notFound = ref(false)

// Form state (only editable fields - name/shortDescription come from manifest)
const form = reactive({
  marketplaceDescription: '', // Markdown description for marketplace
  tags: '',
})

// UI state
const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')

// Editor theme based on color mode
const editorTheme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')

// Editor language
const editorLanguage = computed(() => locale.value === 'de' ? 'de-DE' : 'en-US')

// Sync form changes to store for preview (without saving to server)
watch(() => form.marketplaceDescription, (newDescription) => {
  if (extension.value) {
    const ext = store.extensions.find(e => e.slug === extension.value!.slug)
    if (ext) {
      ext.description = newDescription
    }
  }
})

// Load extension data
onMounted(async () => {
  try {
    // First check if extension is already in store (preserves unsaved changes)
    let found = store.extensions.find(e => e.slug === extensionSlug.value)

    // Only fetch from server if not in store
    if (!found) {
      await store.fetchMyExtensions()
      found = store.extensions.find(e => e.slug === extensionSlug.value)
    }

    if (found) {
      extension.value = found
      // Only update form if it's empty (first load)
      if (!form.marketplaceDescription) {
        form.marketplaceDescription = found.description || ''
        form.tags = found.tags?.join(', ') || ''
      }
    } else {
      notFound.value = true
    }
  } finally {
    loading.value = false
  }
})

// Handle save
async function handleSave() {
  if (!extension.value) return

  saving.value = true
  saveSuccess.value = false
  saveError.value = ''

  try {
    const tags = form.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    await store.updateExtension(extension.value.slug, {
      description: form.marketplaceDescription || undefined,
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

// Handle image upload for md-editor-v3
async function handleEditorUploadImg(files: File[], callback: (urls: string[]) => void) {
  if (!extension.value) return

  const urls: string[] = []
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue
    try {
      const result = await store.uploadMarketplaceImage(extension.value.slug, file)
      urls.push(result.url)
    } catch (err) {
      console.error('Failed to upload image:', err)
    }
  }
  callback(urls)
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
    <div v-else-if="extension" class="space-y-6">
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
          <NuxtLinkLocale :to="`/marketplace/${extension.slug}`">
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
          <!-- Extension Info (read-only from manifest) -->
          <Card>
            <CardHeader>
              <CardTitle>{{ t('developer.extensions.edit.extensionInfo') }}</CardTitle>
              <CardDescription>{{ t('developer.extensions.edit.extensionInfoDescription') }}</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid gap-3 text-sm">
                <div class="flex justify-between py-2 border-b">
                  <span class="text-muted-foreground">{{ t('developer.extensions.new.name') }}</span>
                  <span class="font-medium">{{ extension.name }}</span>
                </div>
                <div class="py-2 border-b">
                  <span class="text-muted-foreground block mb-1">{{ t('developer.extensions.edit.shortDescription') }}</span>
                  <span>{{ extension.shortDescription }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-muted-foreground">{{ t('developer.extensions.edit.latestVersion') }}</span>
                  <span class="font-mono">{{ extension.latestVersion || '-' }}</span>
                </div>
                <div class="py-2">
                  <span class="text-muted-foreground block mb-1">{{ t('developer.extensions.new.publicKey') }}</span>
                  <span class="font-mono text-xs break-all">{{ extension.publicKey }}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Marketplace Description (editable) -->
          <Card>
            <CardHeader>
              <CardTitle>{{ t('developer.extensions.edit.marketplaceDescription') }}</CardTitle>
              <CardDescription>{{ t('developer.extensions.edit.marketplaceDescriptionHint') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <form @submit.prevent="handleSave" class="space-y-6">
                <!-- Markdown Description with Image Upload -->
                <div class="space-y-2">
                  <Label>{{ t('developer.extensions.edit.description') }}</Label>
                  <ClientOnly>
                    <MdEditor
                      v-model="form.marketplaceDescription"
                      :theme="editorTheme"
                      :language="editorLanguage"
                      :placeholder="t('developer.extensions.edit.descriptionPlaceholder')"
                      :preview="false"
                      :toolbars="['bold', 'italic', 'strikeThrough', '-', 'title', 'quote', 'unorderedList', 'orderedList', '-', 'link', 'image', 'table', 'code', 'codeRow', '-', 'revoke', 'next', '=', 'preview', 'fullscreen']"
                      @on-upload-img="handleEditorUploadImg"
                      style="height: 400px;"
                    />
                  </ClientOnly>
                  <p class="text-xs text-muted-foreground">
                    {{ t('developer.extensions.edit.markdownSupported') }}
                  </p>
                </div>

                <!-- Tags -->
                <div class="space-y-2">
                  <Label for="tags">{{ t('developer.extensions.new.tags') }}</Label>
                  <Input
                    id="tags"
                    v-model="form.tags"
                    placeholder="productivity, notes, sync"
                  />
                  <p class="text-xs text-muted-foreground">
                    {{ t('developer.extensions.edit.tagsHint') }}
                  </p>
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
                <Button type="submit" :disabled="saving">
                  <Loader2 v-if="saving" class="h-4 w-4 mr-2 animate-spin" />
                  {{ saving ? t('developer.extensions.edit.saving') : t('developer.extensions.edit.save') }}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Stats -->
          <Card>
            <CardHeader>
              <CardTitle class="text-base">{{ t('developer.extensions.edit.statistics') }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="flex justify-between">
                <span class="text-muted-foreground">{{ t('developer.extensions.edit.downloads') }}</span>
                <span class="font-medium">{{ extension.totalDownloads.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">{{ t('developer.extensions.edit.rating') }}</span>
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
