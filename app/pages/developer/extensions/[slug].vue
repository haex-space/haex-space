<script setup lang="ts">
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Package, ExternalLink, Upload, FileArchive, Save } from 'lucide-vue-next'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useMarketplaceStore, type Extension } from '~/stores/marketplace'
import { useExtensionUpload } from '~/composables/useExtensionUpload'

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

// Version upload using composable with validation
const {
  file: versionFile,
  manifest: versionManifest,
  iconUrl: versionIconUrl,
  parseError: versionParseError,
  dropZoneRef: versionDropZoneRef,
  isOverDropZone: isOverVersionDropZone,
  handleFileInput: handleVersionFileInput,
  clear: clearVersionFile,
  getIconFile: getVersionIconFile,
} = useExtensionUpload({
  expectedPublicKey: computed(() => extension.value?.publicKey),
  currentVersion: computed(() => extension.value?.latestVersion),
})

// Version upload error state
const versionUploadError = ref('')

// Clear version upload error when a new file is selected
watch(versionFile, () => {
  versionUploadError.value = ''
})

// Editor theme based on color mode
const editorTheme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')

// Editor language
const editorLanguage = computed(() => locale.value === 'de' ? 'de-DE' : 'en-US')

// Track original values to detect changes
const originalDescription = ref('')
const originalTags = ref('')

// Check if there are unsaved changes
const hasUnsavedChanges = computed(() => {
  const descriptionChanged = form.marketplaceDescription !== originalDescription.value
  const tagsChanged = form.tags !== originalTags.value
  const hasNewVersion = !!versionFile.value
  return descriptionChanged || tagsChanged || hasNewVersion
})

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
      // Set form and original values
      form.marketplaceDescription = found.description || ''
      form.tags = found.tags?.join(', ') || ''
      originalDescription.value = form.marketplaceDescription
      originalTags.value = form.tags
    } else {
      notFound.value = true
    }
  } finally {
    loading.value = false
  }
})

// Handle save (including version upload if a new version is selected)
async function handleSave() {
  if (!extension.value) return

  saving.value = true
  saveSuccess.value = false
  saveError.value = ''
  versionUploadError.value = ''

  try {
    // Upload new version if one is selected
    if (versionFile.value && versionManifest.value) {
      // Upload the bundle
      await store.uploadExtensionBundle(
        extension.value.slug,
        versionFile.value,
        versionManifest.value.version,
        versionManifest.value as unknown as Record<string, unknown>
      )

      // Upload icon if available
      const iconFile = await getVersionIconFile()
      if (iconFile) {
        try {
          await store.uploadExtensionIcon(extension.value.slug, iconFile)
        } catch (iconErr) {
          console.error('Failed to upload icon:', iconErr)
        }
      }

      // Update local extension data with new version info
      extension.value.latestVersion = versionManifest.value.version
      extension.value.shortDescription = versionManifest.value.description || extension.value.shortDescription
      clearVersionFile()
    }

    // Update marketplace description and tags
    const tags = form.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    await store.updateExtension(extension.value.slug, {
      description: form.marketplaceDescription || undefined,
      tags,
    })

    // Refresh extension data
    await store.fetchMyExtensions()
    const updated = store.extensions.find(e => e.slug === extension.value!.slug)
    if (updated) {
      extension.value = updated
      // Update original values to match current form (no more unsaved changes)
      originalDescription.value = form.marketplaceDescription
      originalTags.value = form.tags
    }

    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('Version already exists')) {
      versionUploadError.value = t('developer.extensions.new.upload.versionExists')
    } else {
      saveError.value = message
    }
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
          <div class="w-16 h-16 rounded-lg bg-muted flex items-center justify-center relative">
            <img
              v-if="versionIconUrl || extension.iconUrl"
              :src="versionIconUrl || extension.iconUrl"
              :alt="extension.name"
              class="w-14 h-14 rounded"
            />
            <Package v-else class="h-8 w-8 text-muted-foreground" />
            <!-- Indicator for pending icon update -->
            <div v-if="versionIconUrl" class="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <span class="text-[10px] text-primary-foreground font-bold">!</span>
            </div>
          </div>
          <div>
            <h1 class="text-3xl font-bold">{{ extension.name }}</h1>
            <div class="flex items-center gap-2 mt-1">
              <Badge v-if="hasUnsavedChanges" variant="secondary">
                {{ t('developer.extensions.edit.unsavedChanges') }}
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
          <Button size="sm" :disabled="saving || !hasUnsavedChanges" @click="handleSave">
            <Loader2 v-if="saving" class="h-4 w-4 mr-2 animate-spin" />
            <CheckCircle v-else-if="saveSuccess" class="h-4 w-4 mr-2" />
            <Save v-else class="h-4 w-4 mr-2" />
            {{ saving ? t('developer.extensions.edit.saving') : t('developer.extensions.edit.save') }}
          </Button>
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
                <div v-if="extension.author" class="flex justify-between py-2 border-b">
                  <span class="text-muted-foreground">{{ t('developer.extensions.new.upload.author') }}</span>
                  <span>{{ extension.author }}</span>
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

                <!-- Error message -->
                <div v-if="saveError" class="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle class="h-4 w-4" />
                  {{ saveError }}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Version Upload -->
          <Card>
            <CardHeader>
              <CardTitle class="text-base">{{ t('developer.extensions.version.upload') }}</CardTitle>
              <CardDescription>{{ t('developer.extensions.version.uploadDescription') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <!-- Dropzone (when no file selected) -->
              <div v-if="!versionManifest" class="space-y-3">
                <div
                  ref="versionDropZoneRef"
                  class="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer"
                  :class="[
                    isOverVersionDropZone ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
                    versionParseError ? 'border-destructive' : ''
                  ]"
                  @click="($refs.versionFileInput as HTMLInputElement).click()"
                >
                  <input
                    ref="versionFileInput"
                    type="file"
                    accept=".xt"
                    class="hidden"
                    @change="handleVersionFileInput"
                  />
                  <Upload class="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p class="text-sm font-medium">
                    {{ t('developer.extensions.new.upload.dropzone') }}
                  </p>
                  <p class="text-xs text-muted-foreground mt-1">
                    {{ t('developer.extensions.new.upload.formats') }}
                  </p>
                </div>

                <!-- Parse Error -->
                <div v-if="versionParseError" class="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle class="h-4 w-4 shrink-0" />
                  <span>{{ versionParseError }}</span>
                </div>
              </div>

              <!-- Selected file info (preview only - upload happens on save) -->
              <div v-else class="space-y-3">
                <div class="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <img v-if="versionIconUrl" :src="versionIconUrl" alt="Extension icon" class="h-8 w-8 rounded object-contain" />
                  <FileArchive v-else class="h-8 w-8 text-primary shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">{{ versionFile?.name }}</p>
                    <p class="text-xs text-muted-foreground">
                      v{{ versionManifest.version }}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" @click="clearVersionFile">
                    {{ t('common.remove') }}
                  </Button>
                </div>

                <!-- Version changes preview -->
                <div class="text-sm space-y-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p class="font-medium text-primary">{{ t('developer.extensions.version.changes') }}</p>
                  <div class="space-y-1 text-muted-foreground">
                    <p>{{ t('developer.extensions.edit.latestVersion') }}: <span class="font-mono">{{ extension?.latestVersion || '-' }}</span> → <span class="font-mono text-foreground">{{ versionManifest.version }}</span></p>
                    <p v-if="versionManifest.description !== extension?.shortDescription">
                      {{ t('developer.extensions.edit.shortDescription') }}: <span class="text-foreground">{{ versionManifest.description }}</span>
                    </p>
                    <p v-if="versionIconUrl">
                      {{ t('developer.extensions.edit.icon') }}: <span class="text-foreground">{{ t('developer.extensions.version.iconUpdated') }}</span>
                    </p>
                  </div>
                </div>

                <!-- Upload Error -->
                <div v-if="versionUploadError" class="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle class="h-4 w-4 shrink-0" />
                  <span>{{ versionUploadError }}</span>
                </div>

                <!-- Info hint -->
                <p class="text-xs text-muted-foreground">
                  {{ t('developer.extensions.version.uploadOnSave') }}
                </p>
              </div>
            </CardContent>
          </Card>

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
