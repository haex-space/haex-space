<script setup lang="ts">
import { HardDrive, Code, Save, Trash2, List } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.sdkStorage.toc.overview'), level: 2 },
  { id: 'basic-usage', title: t('docs.sdkStorage.toc.basicUsage'), level: 2 },
  { id: 'methods', title: t('docs.sdkStorage.toc.methods'), level: 2 },
  { id: 'json-data', title: t('docs.sdkStorage.toc.jsonData'), level: 2 },
  { id: 'examples', title: t('docs.sdkStorage.toc.examples'), level: 2 },
]

const code = {
  basicUsage: `import { useHaexClient } from '@haex-space/vault-sdk/vue'

const client = useHaexClient()

// Store a value
await client.storage.set('username', 'john_doe')

// Retrieve a value
const username = await client.storage.get('username')
console.log(username) // 'john_doe'

// Remove a value
await client.storage.remove('username')`,

  get: `// get(key: string): Promise<string | null>
// Retrieves a value by key, returns null if not found

const value = await client.storage.get('theme')

if (value !== null) {
  console.log('Theme:', value)
} else {
  console.log('No theme set, using default')
}`,

  set: `// set(key: string, value: string): Promise<void>
// Stores a key-value pair

await client.storage.set('theme', 'dark')
await client.storage.set('sidebar_collapsed', 'true')
await client.storage.set('last_sync', Date.now().toString())`,

  remove: `// remove(key: string): Promise<void>
// Removes a key-value pair

await client.storage.remove('theme')
await client.storage.remove('temporary_data')`,

  keys: `// keys(): Promise<string[]>
// Returns all stored keys

const allKeys = await client.storage.keys()
console.log(allKeys) // ['theme', 'sidebar_collapsed', 'last_sync']

// Iterate over all stored data
for (const key of allKeys) {
  const value = await client.storage.get(key)
  console.log(\`\${key}: \${value}\`)
}`,

  clear: `// clear(): Promise<void>
// Removes all stored data for this extension

await client.storage.clear()`,

  jsonData: `// Store JSON data by serializing it
const settings = {
  theme: 'dark',
  fontSize: 14,
  notifications: true
}

await client.storage.set('settings', JSON.stringify(settings))

// Retrieve and parse JSON
const storedSettings = await client.storage.get('settings')
if (storedSettings) {
  const parsed = JSON.parse(storedSettings)
  console.log(parsed.theme) // 'dark'
}`,

  exampleSettings: `// settings.ts - A simple settings manager
import { useHaexClient } from '@haex-space/vault-sdk/vue'

interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  fontSize: number
  autoSave: boolean
  language: string
}

const defaultSettings: AppSettings = {
  theme: 'system',
  fontSize: 14,
  autoSave: true,
  language: 'en'
}

export function useSettings() {
  const client = useHaexClient()
  const settings = ref<AppSettings>(defaultSettings)

  async function loadSettings() {
    const stored = await client.storage.get('app_settings')
    if (stored) {
      settings.value = { ...defaultSettings, ...JSON.parse(stored) }
    }
  }

  async function saveSettings(newSettings: Partial<AppSettings>) {
    settings.value = { ...settings.value, ...newSettings }
    await client.storage.set('app_settings', JSON.stringify(settings.value))
  }

  async function resetSettings() {
    settings.value = defaultSettings
    await client.storage.remove('app_settings')
  }

  return { settings, loadSettings, saveSettings, resetSettings }
}`,

  exampleCache: `// Simple cache with expiration
const CACHE_PREFIX = 'cache_'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  expires: number
}

async function getCached<T>(key: string): Promise<T | null> {
  const stored = await client.storage.get(CACHE_PREFIX + key)
  if (!stored) return null

  const entry: CacheEntry<T> = JSON.parse(stored)
  if (Date.now() > entry.expires) {
    await client.storage.remove(CACHE_PREFIX + key)
    return null
  }

  return entry.data
}

async function setCached<T>(key: string, data: T, ttl = CACHE_TTL) {
  const entry: CacheEntry<T> = {
    data,
    expires: Date.now() + ttl
  }
  await client.storage.set(CACHE_PREFIX + key, JSON.stringify(entry))
}

// Usage
const userData = await getCached<User>('user_profile')
if (!userData) {
  const fresh = await fetchUserProfile()
  await setCached('user_profile', fresh)
}`
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <NuxtLinkLocale to="/docs" class="hover:text-foreground">{{ t('docs.title') }}</NuxtLinkLocale>
        <span>/</span>
        <NuxtLinkLocale to="/docs/sdk" class="hover:text-foreground">{{ t('docs.nav.sdkReference') }}</NuxtLinkLocale>
        <span>/</span>
        <span>{{ t('docs.nav.sdkStorage') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.sdkStorage.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.sdkStorage.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.sdkStorage.sections.overview.title')" :icon="HardDrive">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkStorage.sections.overview.intro') }}</p>

      <DocsAlert type="info">
        {{ t('docs.sdkStorage.sections.overview.note') }}
      </DocsAlert>
    </DocsSection>

    <!-- Basic Usage -->
    <DocsSection id="basic-usage" :title="t('docs.sdkStorage.sections.basicUsage.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkStorage.sections.basicUsage.intro') }}</p>
      <DocsCodeBlock :code="code.basicUsage" language="typescript" />
    </DocsSection>

    <!-- Methods -->
    <DocsSection id="methods" :title="t('docs.sdkStorage.sections.methods.title')" :icon="Code">
      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <Code class="w-4 h-4 text-primary" />
        get()
      </h3>
      <DocsCodeBlock :code="code.get" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <Save class="w-4 h-4 text-primary" />
        set()
      </h3>
      <DocsCodeBlock :code="code.set" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <Trash2 class="w-4 h-4 text-primary" />
        remove()
      </h3>
      <DocsCodeBlock :code="code.remove" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <List class="w-4 h-4 text-primary" />
        keys()
      </h3>
      <DocsCodeBlock :code="code.keys" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <Trash2 class="w-4 h-4 text-primary" />
        clear()
      </h3>
      <DocsCodeBlock :code="code.clear" language="typescript" />
    </DocsSection>

    <!-- JSON Data -->
    <DocsSection id="json-data" :title="t('docs.sdkStorage.sections.jsonData.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkStorage.sections.jsonData.intro') }}</p>
      <DocsCodeBlock :code="code.jsonData" language="typescript" />

      <DocsAlert type="warning" class="mt-6">
        {{ t('docs.sdkStorage.sections.jsonData.warning') }}
      </DocsAlert>
    </DocsSection>

    <!-- Examples -->
    <DocsSection id="examples" :title="t('docs.sdkStorage.sections.examples.title')" :icon="Code">
      <h3 class="font-semibold mb-3">{{ t('docs.sdkStorage.sections.examples.settings') }}</h3>
      <p class="text-sm text-muted-foreground mb-3">{{ t('docs.sdkStorage.sections.examples.settingsDesc') }}</p>
      <DocsCodeBlock :code="code.exampleSettings" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkStorage.sections.examples.cache') }}</h3>
      <p class="text-sm text-muted-foreground mb-3">{{ t('docs.sdkStorage.sections.examples.cacheDesc') }}</p>
      <DocsCodeBlock :code="code.exampleCache" language="typescript" />
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLinkLocale to="/docs/sdk/database" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.sdkDatabase') }}</span>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/docs/sdk/filesystem" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.sdkFilesystem') }}</span>
        <span>&rarr;</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
