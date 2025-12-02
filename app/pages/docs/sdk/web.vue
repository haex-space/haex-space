<script setup lang="ts">
import { Globe, Code, ExternalLink, FileJson, FileText, Image } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.sdkWeb.toc.overview'), level: 2 },
  { id: 'fetch', title: t('docs.sdkWeb.toc.fetch'), level: 2 },
  { id: 'convenience-methods', title: t('docs.sdkWeb.toc.convenienceMethods'), level: 2 },
  { id: 'open-url', title: t('docs.sdkWeb.toc.openUrl'), level: 2 },
  { id: 'permissions', title: t('docs.sdkWeb.toc.permissions'), level: 2 },
  { id: 'types', title: t('docs.sdkWeb.toc.types'), level: 2 },
]

const code = {
  overview: `import { useHaexClient } from '@haex-space/vault-sdk/vue'

const client = useHaexClient()

// Fetch data from an API
const response = await client.web.fetchAsync('https://api.example.com/data')

// Convenience methods for common formats
const json = await client.web.fetchJsonAsync('https://api.example.com/users')
const text = await client.web.fetchTextAsync('https://example.com/readme.txt')
const blob = await client.web.fetchBlobAsync('https://example.com/image.png')

// Open URL in default browser
await client.web.openAsync('https://example.com')`,

  fetch: `// fetchAsync(url: string, options?: WebRequestOptions): Promise<WebResponse>

// Simple GET request
const response = await client.web.fetchAsync('https://api.example.com/users')
console.log('Status:', response.status)
console.log('Data:', response.data)

// POST request with JSON body
const createResponse = await client.web.fetchAsync('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
})

// Handle response
if (createResponse.status === 201) {
  const user = JSON.parse(createResponse.data)
  console.log('Created user:', user)
}`,

  fetchWithHeaders: `// Request with custom headers
const response = await client.web.fetchAsync('https://api.github.com/user', {
  method: 'GET',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': 'token ghp_xxxx'
  }
})

// Access response headers
console.log('Rate limit:', response.headers['x-ratelimit-remaining'])`,

  fetchJson: `// fetchJsonAsync<T>(url: string, options?: WebRequestOptions): Promise<T>
// Fetches and parses JSON automatically

interface User {
  id: number
  name: string
  email: string
}

// Type-safe JSON fetching
const users = await client.web.fetchJsonAsync<User[]>('https://api.example.com/users')

for (const user of users) {
  console.log(user.name, user.email)
}

// With POST
const newUser = await client.web.fetchJsonAsync<User>('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jane', email: 'jane@example.com' })
})`,

  fetchText: `// fetchTextAsync(url: string, options?: WebRequestOptions): Promise<string>
// Fetches and returns text content

const readme = await client.web.fetchTextAsync('https://raw.githubusercontent.com/user/repo/main/README.md')
console.log(readme)

// Fetch and process CSV
const csv = await client.web.fetchTextAsync('https://example.com/data.csv')
const rows = csv.split('\\n').map(row => row.split(','))`,

  fetchBlob: `// fetchBlobAsync(url: string, options?: WebRequestOptions): Promise<Blob>
// Fetches binary data as Blob

const imageBlob = await client.web.fetchBlobAsync('https://example.com/avatar.png')

// Create object URL for display
const imageUrl = URL.createObjectURL(imageBlob)
imageElement.src = imageUrl

// Convert to Uint8Array if needed
const arrayBuffer = await imageBlob.arrayBuffer()
const bytes = new Uint8Array(arrayBuffer)`,

  openUrl: `// openAsync(url: string): Promise<void>
// Opens URL in the user's default browser

// Open a webpage
await client.web.openAsync('https://example.com')

// Open documentation
await client.web.openAsync('https://docs.example.com/getting-started')

// Open with parameters
const searchQuery = encodeURIComponent('haex vault')
await client.web.openAsync(\`https://google.com/search?q=\${searchQuery}\`)`,

  permissions: `// HTTP permissions must be declared in manifest.json

// manifest.json
{
  "permissions": {
    "http": [
      "https://api.example.com/**",
      "https://*.github.com/*"
    ]
  }
}

// Check permission before fetching
const canFetch = await client.checkWebAsync('https://api.example.com/users')

if (canFetch) {
  const data = await client.web.fetchJsonAsync('https://api.example.com/users')
} else {
  console.log('No permission to fetch from this URL')
}`,

  types: `interface WebRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: string
  timeout?: number  // milliseconds
}

interface WebResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: string
}

// Example response
{
  status: 200,
  statusText: 'OK',
  headers: {
    'content-type': 'application/json',
    'x-request-id': 'abc123'
  },
  data: '{"users": [...]}'
}`
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <!-- Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <NuxtLink to="/docs" class="hover:text-foreground">{{ t('docs.title') }}</NuxtLink>
        <span>/</span>
        <NuxtLink to="/docs/sdk" class="hover:text-foreground">{{ t('docs.nav.sdkReference') }}</NuxtLink>
        <span>/</span>
        <span>{{ t('docs.nav.sdkWeb') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.sdkWeb.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.sdkWeb.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.sdkWeb.sections.overview.title')" :icon="Globe">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.overview.intro') }}</p>
      <DocsCodeBlock :code="code.overview" language="typescript" />

      <DocsAlert type="warning" class="mt-6">
        {{ t('docs.sdkWeb.sections.overview.warning') }}
      </DocsAlert>
    </DocsSection>

    <!-- Fetch -->
    <DocsSection id="fetch" :title="t('docs.sdkWeb.sections.fetch.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.fetch.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.sdkWeb.sections.fetch.basic') }}</h3>
      <DocsCodeBlock :code="code.fetch" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkWeb.sections.fetch.headers') }}</h3>
      <DocsCodeBlock :code="code.fetchWithHeaders" language="typescript" />
    </DocsSection>

    <!-- Convenience Methods -->
    <DocsSection id="convenience-methods" :title="t('docs.sdkWeb.sections.convenienceMethods.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.convenienceMethods.intro') }}</p>

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <FileJson class="w-4 h-4 text-primary" />
        fetchJsonAsync()
      </h3>
      <DocsCodeBlock :code="code.fetchJson" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <FileText class="w-4 h-4 text-primary" />
        fetchTextAsync()
      </h3>
      <DocsCodeBlock :code="code.fetchText" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <Image class="w-4 h-4 text-primary" />
        fetchBlobAsync()
      </h3>
      <DocsCodeBlock :code="code.fetchBlob" language="typescript" />
    </DocsSection>

    <!-- Open URL -->
    <DocsSection id="open-url" :title="t('docs.sdkWeb.sections.openUrl.title')" :icon="ExternalLink">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.openUrl.intro') }}</p>
      <DocsCodeBlock :code="code.openUrl" language="typescript" />
    </DocsSection>

    <!-- Permissions -->
    <DocsSection id="permissions" :title="t('docs.sdkWeb.sections.permissions.title')" :icon="Globe">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.permissions.intro') }}</p>
      <DocsCodeBlock :code="code.permissions" language="typescript" />

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.sdkWeb.sections.permissions.note') }}
        <NuxtLink to="/docs/extensions/permissions" class="underline hover:no-underline ml-1">
          {{ t('docs.sdkWeb.sections.permissions.learnMore') }}
        </NuxtLink>
      </DocsAlert>
    </DocsSection>

    <!-- Types -->
    <DocsSection id="types" :title="t('docs.sdkWeb.sections.types.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.types.intro') }}</p>
      <DocsCodeBlock :code="code.types" language="typescript" />
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLink to="/docs/sdk/filesystem" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.sdkFilesystem') }}</span>
      </NuxtLink>
      <NuxtLink to="/docs" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.introduction') }}</span>
        <span>&rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>
