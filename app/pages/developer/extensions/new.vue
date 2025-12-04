<script setup lang="ts">
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

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

// Slug utilities
const { slug, error: slugError, isValid: isSlugValid, generate: generateSlug, setError: setSlugError } = useSlug()

// Form state
const form = reactive({
  name: '',
  publicKey: '',
  shortDescription: '',
  description: '',
  tags: '',
})

// Field errors from API validation
const fieldErrors = reactive<Record<string, string>>({})

// UI state
const creating = ref(false)
const error = ref('')

// Parse Zod errors from API response
function parseZodErrors(message: string): Record<string, string> {
  const errors: Record<string, string> = {}
  try {
    const parsed = JSON.parse(message)
    if (Array.isArray(parsed)) {
      for (const err of parsed) {
        if (err.path && err.path.length > 0) {
          errors[err.path[0]] = err.message
        }
      }
    }
  } catch {
    // Not a JSON error, ignore
  }
  return errors
}

// Handle form submission
async function handleSubmit() {
  if (!form.name || !slug.value || !form.shortDescription || !form.publicKey) return

  creating.value = true
  error.value = ''
  slugError.value = ''
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key])

  try {
    const tags = form.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const extension = await store.createExtension({
      name: form.name,
      slug: slug.value,
      publicKey: form.publicKey,
      shortDescription: form.shortDescription,
      description: form.description || undefined,
      tags: tags.length > 0 ? tags : undefined,
    })

    await navigateTo(localePath(`/developer/extensions/${extension.slug}`))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    // Try to parse field-level errors
    const zodErrors = parseZodErrors(message)
    if (Object.keys(zodErrors).length > 0) {
      Object.assign(fieldErrors, zodErrors)
      if (zodErrors.slug) {
        setSlugError(zodErrors.slug)
      }
    } else if (message.includes('slug') || message.includes('taken') || message.includes('duplicate')) {
      setSlugError(t('developer.settings.profile.slugTaken'))
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
          {{ t('developer.extensions.new.description') }}
        </p>
      </div>

      <!-- Form -->
      <Card>
        <CardContent class="pt-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name -->
            <div class="space-y-2">
              <Label for="name">{{ t('developer.extensions.new.name') }}</Label>
              <Input
                id="name"
                v-model="form.name"
                :placeholder="t('developer.extensions.new.name')"
                :class="{ 'border-destructive': fieldErrors.name }"
                required
                @blur="!slug && generateSlug(form.name)"
              />
              <p v-if="fieldErrors.name" class="text-sm text-destructive">
                {{ fieldErrors.name }}
              </p>
              <p v-else class="text-sm text-muted-foreground">
                {{ t('developer.extensions.new.nameDescription') }}
              </p>
            </div>

            <!-- Slug -->
            <div class="space-y-2">
              <Label for="slug">{{ t('developer.extensions.new.slug') }}</Label>
              <Input
                id="slug"
                v-model="slug"
                :placeholder="t('developer.extensions.new.slug')"
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
                {{ t('developer.extensions.new.slugDescription') }}
              </p>
            </div>

            <!-- Public Key -->
            <div class="space-y-2">
              <Label for="publicKey">{{ t('developer.extensions.new.publicKey') }}</Label>
              <Textarea
                id="publicKey"
                v-model="form.publicKey"
                :placeholder="t('developer.extensions.new.publicKeyPlaceholder')"
                :class="{ 'border-destructive': fieldErrors.publicKey }"
                rows="4"
                class="font-mono text-xs"
                required
              />
              <p v-if="fieldErrors.publicKey" class="text-sm text-destructive">
                {{ fieldErrors.publicKey }}
              </p>
              <p v-else class="text-sm text-muted-foreground">
                {{ t('developer.extensions.new.publicKeyDescription') }}
              </p>
            </div>

            <!-- Short Description -->
            <div class="space-y-2">
              <Label for="shortDescription">{{ t('developer.extensions.new.shortDescription') }}</Label>
              <Input
                id="shortDescription"
                v-model="form.shortDescription"
                :placeholder="t('developer.extensions.new.shortDescription')"
                :class="{ 'border-destructive': fieldErrors.shortDescription }"
                maxlength="150"
                required
              />
              <p v-if="fieldErrors.shortDescription" class="text-sm text-destructive">
                {{ fieldErrors.shortDescription }}
              </p>
              <p v-else class="text-sm text-muted-foreground">
                {{ t('developer.extensions.new.shortDescriptionDescription') }}
              </p>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <Label for="description">{{ t('developer.extensions.new.description') }}</Label>
              <Textarea
                id="description"
                v-model="form.description"
                :placeholder="t('developer.extensions.new.description')"
                rows="6"
              />
              <p class="text-sm text-muted-foreground">
                {{ t('developer.extensions.new.descriptionDescription') }}
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
              <p class="text-sm text-muted-foreground">
                {{ t('developer.extensions.new.tagsDescription') }}
              </p>
            </div>

            <!-- Error -->
            <div v-if="error" class="text-sm text-destructive">
              {{ error }}
            </div>

            <!-- Submit -->
            <div class="flex gap-4">
              <Button type="submit" :disabled="creating || !form.name || !slug || !form.publicKey || !form.shortDescription || !isSlugValid">
                <Loader2 v-if="creating" class="h-4 w-4 mr-2 animate-spin" />
                {{ creating ? t('developer.extensions.new.creating') : t('developer.extensions.new.submit') }}
              </Button>
              <NuxtLinkLocale to="/developer/extensions">
                <Button type="button" variant="outline">Cancel</Button>
              </NuxtLinkLocale>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
