<script setup lang="ts">
import { FolderOpen, Save, FileUp, Image, Code } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.sdkFilesystem.toc.overview'), level: 2 },
  { id: 'save-file', title: t('docs.sdkFilesystem.toc.saveFile'), level: 2 },
  { id: 'open-file', title: t('docs.sdkFilesystem.toc.openFile'), level: 2 },
  { id: 'show-image', title: t('docs.sdkFilesystem.toc.showImage'), level: 2 },
  { id: 'types', title: t('docs.sdkFilesystem.toc.types'), level: 2 },
]

const code = {
  overview: `import { useHaexClient } from '@haex-space/vault-sdk/vue'

const client = useHaexClient()

// All filesystem operations show native dialogs
// Users have full control over file access

// Save a file
await client.filesystem.saveFileAsync(data, options)

// Open/read a file
const file = await client.filesystem.openFileAsync(options)

// Display an image
await client.filesystem.showImageAsync(options)`,

  saveFile: `// saveFileAsync(data: Uint8Array, options?: SaveFileOptions): Promise<SaveFileResult | null>

// Save text as a file
const text = 'Hello, World!'
const encoder = new TextEncoder()
const data = encoder.encode(text)

const result = await client.filesystem.saveFileAsync(data, {
  defaultPath: 'hello.txt',
  filters: [
    { name: 'Text Files', extensions: ['txt'] },
    { name: 'All Files', extensions: ['*'] }
  ]
})

if (result) {
  console.log('Saved to:', result.path)
}`,

  saveJson: `// Save JSON data
const settings = { theme: 'dark', fontSize: 14 }
const json = JSON.stringify(settings, null, 2)
const data = new TextEncoder().encode(json)

await client.filesystem.saveFileAsync(data, {
  defaultPath: 'settings.json',
  filters: [{ name: 'JSON Files', extensions: ['json'] }]
})`,

  saveBinary: `// Save binary data (e.g., export)
const exportData = await generateExport()

await client.filesystem.saveFileAsync(exportData, {
  defaultPath: 'backup.dat',
  filters: [{ name: 'Backup Files', extensions: ['dat', 'bak'] }]
})`,

  openFile: `// openFileAsync(options: OpenFileOptions): Promise<OpenFileResult>

// Open a text file
const result = await client.filesystem.openFileAsync({
  filters: [
    { name: 'Text Files', extensions: ['txt', 'md'] },
    { name: 'All Files', extensions: ['*'] }
  ],
  multiple: false
})

if (result.files.length > 0) {
  const file = result.files[0]
  console.log('File path:', file.path)
  console.log('File name:', file.name)
  console.log('File size:', file.size)

  // Read content
  const decoder = new TextDecoder()
  const content = decoder.decode(file.data)
  console.log('Content:', content)
}`,

  openMultiple: `// Open multiple files
const result = await client.filesystem.openFileAsync({
  filters: [{ name: 'Images', extensions: ['png', 'jpg', 'gif'] }],
  multiple: true
})

for (const file of result.files) {
  console.log('Processing:', file.name)
  // Process each file...
}`,

  openJson: `// Open and parse JSON file
const result = await client.filesystem.openFileAsync({
  filters: [{ name: 'JSON Files', extensions: ['json'] }],
  multiple: false
})

if (result.files.length > 0) {
  const content = new TextDecoder().decode(result.files[0].data)
  const data = JSON.parse(content)
  console.log('Loaded data:', data)
}`,

  showImage: `// showImageAsync(options: ShowImageOptions): Promise<ShowImageResult>
// Opens an image picker and returns the selected image

const result = await client.filesystem.showImageAsync({
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8  // JPEG quality (0-1)
})

if (result.data) {
  // Use the image data
  const blob = new Blob([result.data], { type: result.mimeType })
  const url = URL.createObjectURL(blob)

  // Display in img element
  imageElement.src = url
}`,

  types: `interface SaveFileOptions {
  defaultPath?: string
  filters?: FileFilter[]
}

interface SaveFileResult {
  path: string
}

interface OpenFileOptions {
  filters?: FileFilter[]
  multiple?: boolean
}

interface OpenFileResult {
  files: OpenedFile[]
}

interface OpenedFile {
  path: string
  name: string
  size: number
  data: Uint8Array
}

interface FileFilter {
  name: string      // Display name (e.g., "Text Files")
  extensions: string[]  // File extensions without dots (e.g., ["txt", "md"])
}

interface ShowImageOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number  // 0-1, JPEG quality
}

interface ShowImageResult {
  data: Uint8Array | null
  mimeType: string
  width: number
  height: number
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
        <span>{{ t('docs.nav.sdkFilesystem') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.sdkFilesystem.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.sdkFilesystem.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.sdkFilesystem.sections.overview.title')" :icon="FolderOpen">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkFilesystem.sections.overview.intro') }}</p>
      <DocsCodeBlock :code="code.overview" language="typescript" />

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.sdkFilesystem.sections.overview.note') }}
      </DocsAlert>
    </DocsSection>

    <!-- Save File -->
    <DocsSection id="save-file" :title="t('docs.sdkFilesystem.sections.saveFile.title')" :icon="Save">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkFilesystem.sections.saveFile.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.saveFile.text') }}</h3>
      <DocsCodeBlock :code="code.saveFile" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.saveFile.json') }}</h3>
      <DocsCodeBlock :code="code.saveJson" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.saveFile.binary') }}</h3>
      <DocsCodeBlock :code="code.saveBinary" language="typescript" />
    </DocsSection>

    <!-- Open File -->
    <DocsSection id="open-file" :title="t('docs.sdkFilesystem.sections.openFile.title')" :icon="FileUp">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkFilesystem.sections.openFile.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.openFile.single') }}</h3>
      <DocsCodeBlock :code="code.openFile" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.openFile.multiple') }}</h3>
      <DocsCodeBlock :code="code.openMultiple" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.openFile.json') }}</h3>
      <DocsCodeBlock :code="code.openJson" language="typescript" />
    </DocsSection>

    <!-- Show Image -->
    <DocsSection id="show-image" :title="t('docs.sdkFilesystem.sections.showImage.title')" :icon="Image">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkFilesystem.sections.showImage.intro') }}</p>
      <DocsCodeBlock :code="code.showImage" language="typescript" />

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.sdkFilesystem.sections.showImage.note') }}
      </DocsAlert>
    </DocsSection>

    <!-- Types -->
    <DocsSection id="types" :title="t('docs.sdkFilesystem.sections.types.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkFilesystem.sections.types.intro') }}</p>
      <DocsCodeBlock :code="code.types" language="typescript" />
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLink to="/docs/sdk/storage" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.sdkStorage') }}</span>
      </NuxtLink>
      <NuxtLink to="/docs/sdk/web" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.sdkWeb') }}</span>
        <span>&rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>
