<script setup lang="ts">
import { User, Globe, Mail, FileText, Loader2, CheckCircle, AlertCircle, Key, Trash2, Copy, Plus, Check } from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'
import { useMarketplaceStore, type ApiKey } from '~/stores/marketplace'

const { t } = useI18n()
const store = useMarketplaceStore()

useSeoMeta({
  title: 'Publisher Settings - haex.space',
  description: 'Manage your publisher profile on the haex marketplace.',
})

// Slug utilities
const { slug, error: slugError, isValid: isSlugValid, generate: generateSlug, setError: setSlugError } = useSlug()

// Form state
const form = reactive({
  displayName: '',
  email: '',
  website: '',
  description: '',
})

// UI state
const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')

// API Keys state
const apiKeys = ref<ApiKey[]>([])
const apiKeysLoading = ref(false)
const apiKeysError = ref('')
const showCreateKeyDialog = ref(false)
const newKeyName = ref('')
const newKeyExpiry = ref(90)
const creatingKey = ref(false)
const createdKey = ref<string | null>(null)
const deletingKeyId = ref<string | null>(null)
const showDeleteKeyDialog = ref(false)
const keyToDelete = ref<ApiKey | null>(null)

// Load API keys when publisher is available
watch(() => store.hasPublisher, async (hasPublisher) => {
  if (hasPublisher) {
    await loadApiKeys()
  }
}, { immediate: true })

async function loadApiKeys() {
  apiKeysLoading.value = true
  apiKeysError.value = ''
  try {
    apiKeys.value = await store.fetchApiKeys()
  } catch (error) {
    apiKeysError.value = error instanceof Error ? error.message : 'Failed to load API keys'
  } finally {
    apiKeysLoading.value = false
  }
}

async function handleCreateKey() {
  if (!newKeyName.value.trim()) return

  creatingKey.value = true
  try {
    const result = await store.createApiKey(newKeyName.value.trim(), newKeyExpiry.value)
    createdKey.value = result.apiKey.key
    await loadApiKeys()
    newKeyName.value = ''
    newKeyExpiry.value = 90
  } catch (error) {
    apiKeysError.value = error instanceof Error ? error.message : 'Failed to create API key'
  } finally {
    creatingKey.value = false
  }
}

function confirmDeleteKey(key: ApiKey) {
  keyToDelete.value = key
  showDeleteKeyDialog.value = true
}

async function handleDeleteKey() {
  if (!keyToDelete.value) return

  const keyId = keyToDelete.value.id
  deletingKeyId.value = keyId
  try {
    await store.deleteApiKey(keyId)
    apiKeys.value = apiKeys.value.filter((k: ApiKey) => k.id !== keyId)
    showDeleteKeyDialog.value = false
    keyToDelete.value = null
  } catch (error) {
    apiKeysError.value = error instanceof Error ? error.message : 'Failed to delete API key'
  } finally {
    deletingKeyId.value = null
  }
}

// Clipboard with visual feedback
const { copy, copied } = useClipboard({ copiedDuring: 2000 })

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

function closeCreatedKeyDialog() {
  createdKey.value = null
  showCreateKeyDialog.value = false
}

// Initialize form when publisher data loads
watch(() => store.publisher, (publisher) => {
  if (publisher) {
    form.displayName = publisher.displayName || ''
    slug.value = publisher.slug || ''
    form.email = publisher.email || ''
    form.website = publisher.website || ''
    form.description = publisher.description || ''
  }
}, { immediate: true })

// Handle form submission
async function handleSubmit() {
  if (!form.displayName || !slug.value) return

  saving.value = true
  saveSuccess.value = false
  saveError.value = ''
  slugError.value = ''

  try {
    if (store.hasPublisher) {
      // Update existing publisher
      await store.updatePublisher({
        displayName: form.displayName,
        description: form.description || undefined,
        website: form.website || undefined,
        email: form.email || undefined,
      })
    } else {
      // Create new publisher
      await store.createPublisher({
        displayName: form.displayName,
        slug: slug.value,
        description: form.description || undefined,
        website: form.website || undefined,
        email: form.email || undefined,
      })
    }
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message.includes('slug') || message.includes('taken') || message.includes('duplicate')) {
      setSlugError(t('developer.settings.profile.slugTaken'))
    } else {
      saveError.value = t('developer.settings.profile.error')
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="store.loading" class="flex items-center justify-center min-h-[50vh]">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <div v-else class="max-w-2xl mx-auto space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold">{{ t('developer.settings.title') }}</h1>
        <p class="text-muted-foreground mt-1">
          {{ t('developer.settings.description') }}
        </p>
      </div>

      <!-- Publisher Profile Form -->
      <Card>
        <CardHeader>
          <CardTitle>
            {{ store.hasPublisher ? t('developer.settings.profile.title') : t('developer.settings.createProfile.title') }}
          </CardTitle>
          <CardDescription>
            {{ store.hasPublisher ? t('developer.settings.profile.description') : t('developer.settings.createProfile.description') }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Display Name -->
            <div class="space-y-2">
              <Label for="displayName" class="flex items-center gap-2">
                <User class="h-4 w-4" />
                {{ t('developer.settings.profile.displayName') }}
              </Label>
              <Input
                id="displayName"
                v-model="form.displayName"
                :placeholder="t('developer.settings.profile.displayName')"
                required
                @blur="!store.hasPublisher && !slug && generateSlug(form.displayName)"
              />
              <p class="text-sm text-muted-foreground">
                {{ t('developer.settings.profile.displayNameDescription') }}
              </p>
            </div>

            <!-- Slug (only editable when creating) -->
            <div class="space-y-2">
              <Label for="slug" class="flex items-center gap-2">
                <FileText class="h-4 w-4" />
                {{ t('developer.settings.profile.slug') }}
              </Label>
              <Input
                id="slug"
                v-model="slug"
                :placeholder="t('developer.settings.profile.slug')"
                :disabled="store.hasPublisher"
                :class="{ 'border-destructive': slugError || !isSlugValid }"
                required
              />
              <p v-if="slugError" class="text-sm text-destructive">
                {{ slugError }}
              </p>
              <p v-else-if="!isSlugValid" class="text-sm text-destructive">
                Only lowercase letters, numbers, and hyphens allowed.
              </p>
              <p v-else class="text-sm text-muted-foreground">
                {{ t('developer.settings.profile.slugDescription') }}
              </p>
            </div>

            <!-- Contact Email -->
            <div class="space-y-2">
              <Label for="email" class="flex items-center gap-2">
                <Mail class="h-4 w-4" />
                {{ t('developer.settings.profile.email') }}
              </Label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                :placeholder="t('developer.settings.profile.email')"
              />
              <p class="text-sm text-muted-foreground">
                {{ t('developer.settings.profile.emailDescription') }}
              </p>
            </div>

            <!-- Website -->
            <div class="space-y-2">
              <Label for="website" class="flex items-center gap-2">
                <Globe class="h-4 w-4" />
                {{ t('developer.settings.profile.website') }}
              </Label>
              <Input
                id="website"
                v-model="form.website"
                type="url"
                placeholder="https://example.com"
              />
              <p class="text-sm text-muted-foreground">
                {{ t('developer.settings.profile.websiteDescription') }}
              </p>
            </div>

            <!-- Bio/Description -->
            <div class="space-y-2">
              <Label for="description">
                {{ t('developer.settings.profile.bio') }}
              </Label>
              <Textarea
                id="description"
                v-model="form.description"
                :placeholder="t('developer.settings.profile.bio')"
                rows="4"
              />
              <p class="text-sm text-muted-foreground">
                {{ t('developer.settings.profile.bioDescription') }}
              </p>
            </div>

            <!-- Success/Error messages -->
            <div v-if="saveSuccess" class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle class="h-4 w-4" />
              {{ t('developer.settings.profile.saved') }}
            </div>
            <div v-if="saveError" class="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle class="h-4 w-4" />
              {{ saveError }}
            </div>

            <!-- Submit Button -->
            <Button type="submit" :disabled="saving || !form.displayName || !slug || !isSlugValid">
              <Loader2 v-if="saving" class="h-4 w-4 mr-2 animate-spin" />
              {{
                saving
                  ? (store.hasPublisher ? t('developer.settings.profile.saving') : t('developer.settings.createProfile.creating'))
                  : (store.hasPublisher ? t('developer.settings.profile.save') : t('developer.settings.createProfile.submit'))
              }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- API Keys -->
      <Card v-if="store.hasPublisher">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="flex items-center gap-2">
                <Key class="h-5 w-5" />
                {{ t('developer.settings.apiKeys.title') }}
              </CardTitle>
              <CardDescription>
                {{ t('developer.settings.apiKeys.description') }}
              </CardDescription>
            </div>
            <Button size="sm" @click="showCreateKeyDialog = true">
              <Plus class="h-4 w-4 mr-2" />
              {{ t('developer.settings.apiKeys.create') }}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <!-- Loading -->
          <div v-if="apiKeysLoading" class="flex items-center justify-center py-8">
            <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
          </div>

          <!-- Error -->
          <div v-else-if="apiKeysError" class="flex items-center gap-2 text-sm text-destructive py-4">
            <AlertCircle class="h-4 w-4" />
            {{ apiKeysError }}
          </div>

          <!-- Empty state -->
          <div v-else-if="apiKeys.length === 0" class="text-center py-8 text-muted-foreground">
            <Key class="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{{ t('developer.settings.apiKeys.empty') }}</p>
            <p class="text-sm mt-1">{{ t('developer.settings.apiKeys.emptyHint') }}</p>
          </div>

          <!-- API Keys list -->
          <div v-else class="space-y-3">
            <div
              v-for="key in apiKeys"
              :key="key.id"
              class="flex items-center justify-between p-3 rounded-lg border"
              :class="{ 'border-destructive/50 bg-destructive/5': key.expired }"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ key.name }}</span>
                  <Badge v-if="key.expired" variant="destructive">
                    {{ t('developer.settings.apiKeys.expired') }}
                  </Badge>
                </div>
                <div class="text-sm text-muted-foreground space-x-4">
                  <span>{{ key.keyPrefix }}...</span>
                  <span>{{ t('developer.settings.apiKeys.expires') }}: {{ formatDate(key.expiresAt) }}</span>
                  <span v-if="key.lastUsedAt">
                    {{ t('developer.settings.apiKeys.lastUsed') }}: {{ formatDate(key.lastUsedAt) }}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                @click="confirmDeleteKey(key)"
              >
                <Trash2 class="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Delete API Key Confirmation Dialog -->
      <Dialog v-model:open="showDeleteKeyDialog">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{ t('developer.settings.apiKeys.deleteTitle') }}</DialogTitle>
            <DialogDescription>
              {{ t('developer.settings.apiKeys.deleteDescription', { name: keyToDelete?.name }) }}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" @click="showDeleteKeyDialog = false" :disabled="deletingKeyId !== null">
              {{ t('developer.settings.apiKeys.cancel') }}
            </Button>
            <Button type="button" variant="destructive" @click="handleDeleteKey" :disabled="deletingKeyId !== null">
              <Loader2 v-if="deletingKeyId !== null" class="h-4 w-4 mr-2 animate-spin" />
              {{ t('developer.settings.apiKeys.deleteConfirm') }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Create API Key Dialog -->
      <Dialog v-model:open="showCreateKeyDialog">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{ t('developer.settings.apiKeys.createTitle') }}</DialogTitle>
            <DialogDescription>
              {{ t('developer.settings.apiKeys.createDescription') }}
            </DialogDescription>
          </DialogHeader>

          <!-- Show created key -->
          <div v-if="createdKey" class="space-y-4">
            <div class="p-4 rounded-lg bg-muted">
              <p class="text-sm font-medium mb-2">{{ t('developer.settings.apiKeys.yourKey') }}</p>
              <div class="flex items-center gap-2">
                <code class="flex-1 text-sm bg-background p-2 rounded border break-all">{{ createdKey }}</code>
                <Button size="icon" variant="outline" @click="copy(createdKey!)">
                  <Check v-if="copied" class="h-4 w-4 text-green-500" />
                  <Copy v-else class="h-4 w-4" />
                </Button>
              </div>
              <p class="text-sm text-destructive mt-2">
                {{ t('developer.settings.apiKeys.keyWarning') }}
              </p>
            </div>
            <DialogFooter>
              <Button @click="closeCreatedKeyDialog">
                {{ t('developer.settings.apiKeys.done') }}
              </Button>
            </DialogFooter>
          </div>

          <!-- Create form -->
          <form v-else @submit.prevent="handleCreateKey" class="space-y-4">
            <div class="space-y-2">
              <Label for="keyName">{{ t('developer.settings.apiKeys.name') }}</Label>
              <Input
                id="keyName"
                v-model="newKeyName"
                :placeholder="t('developer.settings.apiKeys.namePlaceholder')"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="keyExpiry">{{ t('developer.settings.apiKeys.expiry') }}</Label>
              <Select v-model="newKeyExpiry">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="30">30 {{ t('developer.settings.apiKeys.days') }}</SelectItem>
                  <SelectItem :value="90">90 {{ t('developer.settings.apiKeys.days') }}</SelectItem>
                  <SelectItem :value="180">180 {{ t('developer.settings.apiKeys.days') }}</SelectItem>
                  <SelectItem :value="365">365 {{ t('developer.settings.apiKeys.days') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" @click="showCreateKeyDialog = false">
                {{ t('developer.settings.apiKeys.cancel') }}
              </Button>
              <Button type="submit" :disabled="creatingKey || !newKeyName.trim()">
                <Loader2 v-if="creatingKey" class="h-4 w-4 mr-2 animate-spin" />
                {{ t('developer.settings.apiKeys.createButton') }}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <!-- Account Settings -->
      <Card>
        <CardHeader>
          <CardTitle>{{ t('developer.settings.account.title') }}</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ t('developer.settings.account.email') }}</p>
              <p class="text-sm text-muted-foreground">{{ store.user?.email }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
