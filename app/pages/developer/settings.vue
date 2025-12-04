<script setup lang="ts">
import { User, Globe, Mail, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

definePageMeta({
  layout: false, // Layout handled by parent developer.vue
})

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
