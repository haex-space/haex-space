<script setup lang="ts">
import { ArrowLeft, Loader2, Upload, FileArchive, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'
import JSZip from 'jszip'
import type { ExtensionManifest } from '@haex-space/vault-sdk'

definePageMeta({
  layout: false,
})

const { t } = useI18n()
const localePath = useLocalePath()
const store = useMarketplaceStore()

useSeoMeta({
  title: 'Create Extension - haex.space',
  description: 'Create a new extension for the haex marketplace.',
})

// State
const file = ref<File | null>(null)
const manifest = ref<ExtensionManifest | null>(null)
const iconUrl = ref<string | null>(null)
const parseError = ref('')
const isDragging = ref(false)
const creating = ref(false)
const error = ref('')

// Computed
const isValidExtension = computed(() => !!manifest.value && !!file.value)

// Handle file drop
function handleDrop(e: DragEvent) {
  isDragging.value = false
  const droppedFile = e.dataTransfer?.files[0]
  if (droppedFile) {
    processFile(droppedFile)
  }
}

// Handle file input change
function handleFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    processFile(selectedFile)
  }
}

// Process uploaded file
async function processFile(uploadedFile: File) {
  // Reset state
  file.value = null
  manifest.value = null
  iconUrl.value = null
  parseError.value = ''
  error.value = ''

  // Validate file extension
  if (!uploadedFile.name.endsWith('.xt')) {
    parseError.value = t('developer.extensions.new.upload.invalidFormat')
    return
  }

  try {
    const zip = await JSZip.loadAsync(uploadedFile)

    // Read manifest.json from haextension folder
    const manifestFile = zip.file('haextension/manifest.json')
    if (!manifestFile) {
      parseError.value = t('developer.extensions.new.upload.noManifest')
      return
    }

    const manifestContent = await manifestFile.async('string')
    const parsedManifest = JSON.parse(manifestContent) as ExtensionManifest

    // Validate required fields
    if (!parsedManifest.name || !parsedManifest.publicKey || !parsedManifest.version) {
      parseError.value = t('developer.extensions.new.upload.invalidManifest')
      return
    }

    // Extract icon (default: favicon.ico in root)
    const iconName = parsedManifest.icon || 'favicon.ico'
    // Try root first, then haextension folder
    const iconFile = zip.file(iconName) || zip.file(`haextension/${iconName}`)

    if (iconFile) {
      const iconBlob = await iconFile.async('blob')
      const iconPath = iconName.toLowerCase()
      const mimeType = iconPath.endsWith('.svg') ? 'image/svg+xml'
        : iconPath.endsWith('.png') ? 'image/png'
        : iconPath.endsWith('.jpg') || iconPath.endsWith('.jpeg') ? 'image/jpeg'
        : iconPath.endsWith('.ico') ? 'image/x-icon'
        : iconPath.endsWith('.webp') ? 'image/webp'
        : 'image/png'
      iconUrl.value = URL.createObjectURL(new Blob([iconBlob], { type: mimeType }))
    }

    file.value = uploadedFile
    manifest.value = parsedManifest
  } catch (err) {
    console.error('Failed to parse extension:', err)
    parseError.value = t('developer.extensions.new.upload.parseError')
  }
}

// Clear selected file
function clearFile() {
  if (iconUrl.value) {
    URL.revokeObjectURL(iconUrl.value)
  }
  file.value = null
  manifest.value = null
  iconUrl.value = null
  parseError.value = ''
  error.value = ''
}

// Handle form submission
async function handleSubmit() {
  if (!file.value || !manifest.value) return

  creating.value = true
  error.value = ''

  const slug = manifest.value.name

  try {
    // Try to create the extension first
    try {
      await store.createExtension({
        name: manifest.value.name,
        slug,
        publicKey: manifest.value.publicKey,
        shortDescription: manifest.value.description || `${manifest.value.name} extension`,
        description: manifest.value.description || undefined,
      })
    } catch (createErr: unknown) {
      // If extension already exists, that's fine - we'll just upload a new version
      const message = createErr instanceof Error ? createErr.message : ''
      if (!message.includes('already taken') && !message.includes('already exists')) {
        throw createErr
      }
    }

    // Upload the bundle with version info and manifest
    await store.uploadExtensionBundle(slug, file.value, manifest.value.version, manifest.value as unknown as Record<string, unknown>)

    await navigateTo(localePath(`/developer/extensions/${slug}`))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    // Map API error messages to i18n keys
    if (message.includes('Version already exists')) {
      error.value = t('developer.extensions.new.upload.versionExists')
    } else {
      error.value = message
    }
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Back Link -->
      <NuxtLinkLocale to="/developer/extensions" class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft class="h-4 w-4" />
        {{ t('developer.extensions.title') }}
      </NuxtLinkLocale>

      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold">{{ t('developer.extensions.new.title') }}</h1>
        <p class="text-muted-foreground mt-1">
          {{ t('developer.extensions.new.upload.description') }}
        </p>
      </div>

      <!-- Upload Area -->
      <Card>
        <CardContent class="pt-6">
          <div v-if="!manifest" class="space-y-4">
            <!-- Dropzone -->
            <div
              class="border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer"
              :class="[
                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
                parseError ? 'border-destructive' : ''
              ]"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="($refs.fileInput as HTMLInputElement).click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".xt"
                class="hidden"
                @change="handleFileInput"
              />
              <Upload class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p class="text-lg font-medium mb-1">
                {{ t('developer.extensions.new.upload.dropzone') }}
              </p>
              <p class="text-sm text-muted-foreground">
                {{ t('developer.extensions.new.upload.formats') }}
              </p>
            </div>

            <!-- Parse Error -->
            <div v-if="parseError" class="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle class="h-4 w-4" />
              {{ parseError }}
            </div>
          </div>

          <!-- Parsed Extension Info -->
          <div v-else class="space-y-6">
            <!-- File Info -->
            <div class="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <img v-if="iconUrl" :src="iconUrl" alt="Extension icon" class="h-10 w-10 rounded object-contain" />
              <FileArchive v-else class="h-10 w-10 text-primary" />
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">{{ file?.name }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ (file?.size || 0 / 1024).toFixed(1) }} KB
                </p>
              </div>
              <Button variant="ghost" size="sm" @click="clearFile">
                {{ t('common.remove') }}
              </Button>
            </div>

            <!-- Extension Details -->
            <div class="space-y-4">
              <div class="flex items-center gap-2 text-primary">
                <CheckCircle2 class="h-5 w-5" />
                <span class="font-medium">{{ t('developer.extensions.new.upload.valid') }}</span>
              </div>

              <div class="grid gap-3 text-sm">
                <div class="flex justify-between py-2 border-b">
                  <span class="text-muted-foreground">{{ t('developer.extensions.new.name') }}</span>
                  <span class="font-medium">{{ manifest.name }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-muted-foreground">{{ t('developer.extensions.version.number') }}</span>
                  <span class="font-mono">{{ manifest.version }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-muted-foreground">{{ t('developer.extensions.new.upload.author') }}</span>
                  <span>{{ manifest.author }}</span>
                </div>
                <div v-if="manifest.description" class="py-2 border-b">
                  <span class="text-muted-foreground block mb-1">{{ t('developer.extensions.new.description') }}</span>
                  <span>{{ manifest.description }}</span>
                </div>
                <div class="py-2 border-b">
                  <span class="text-muted-foreground block mb-1">{{ t('developer.extensions.new.publicKey') }}</span>
                  <span class="font-mono text-xs break-all">{{ manifest.publicKey }}</span>
                </div>
                <div v-if="manifest.permissions.http.length > 0" class="py-2">
                  <span class="text-muted-foreground block mb-1">{{ t('developer.extensions.new.upload.permissions') }}</span>
                  <div class="flex flex-wrap gap-1">
                    <Badge v-for="perm in manifest.permissions.http" :key="perm.target" variant="secondary">
                      {{ perm.target }}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle class="h-4 w-4" />
              {{ error }}
            </div>

            <!-- Submit -->
            <div class="flex gap-4 pt-4">
              <Button @click="handleSubmit" :disabled="creating || !isValidExtension">
                <Loader2 v-if="creating" class="h-4 w-4 mr-2 animate-spin" />
                {{ creating ? t('developer.extensions.new.creating') : t('developer.extensions.new.submit') }}
              </Button>
              <Button variant="outline" @click="clearFile">
                {{ t('common.cancel') }}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
