<script setup lang="ts">
import { Code, FileJson, Key, Settings, Eye, Puzzle } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.manifest.toc.overview'), level: 2 },
  { id: 'required-fields', title: t('docs.manifest.toc.requiredFields'), level: 2 },
  { id: 'optional-fields', title: t('docs.manifest.toc.optionalFields'), level: 2 },
  { id: 'display-modes', title: t('docs.manifest.toc.displayModes'), level: 2 },
  { id: 'permissions', title: t('docs.manifest.toc.permissions'), level: 2 },
  { id: 'complete-example', title: t('docs.manifest.toc.completeExample'), level: 2 },
]

const code = {
  simpleManifest: `{
  "name": "my-extension",
  "version": "1.0.0",
  "public_key": "a1b2c3d4e5f6..."
}`,

  fullManifest: `{
  "name": "password-manager",
  "version": "1.0.0",
  "author": "John Doe",
  "description": "Securely store and manage your passwords",
  "homepage": "https://example.com/password-manager",

  "entry": "index.html",
  "icon": "icon.png",
  "display_mode": "window",
  "single_instance": true,

  "public_key": "a1b2c3d4e5f6...",
  "signature": "",

  "permissions": {
    "database": [],
    "filesystem": [
      { "target": "**/*.json", "operation": "read_write" }
    ],
    "http": [
      { "target": "https://api.haveibeenpwned.com/**" }
    ],
    "shell": null
  }
}`,

  permissionsDatabase: `"permissions": {
  "database": [
    { "target": "MCowBQYDK2Vw...__other-extension__users", "operation": "read" },
    { "target": "MCowBQYDK2Vw...__other-extension__settings", "operation": "read_write" }
  ]
}`,

  permissionsFilesystem: `"permissions": {
  "filesystem": [
    { "target": "**/*.txt", "operation": "read" },
    { "target": "exports/**", "operation": "read_write" }
  ]
}`,

  permissionsHttp: `"permissions": {
  "http": [
    { "target": "https://api.example.com/**" },
    { "target": "https://*.github.com/api/*" }
  ]
}`
}

const requiredFields = computed(() => [
  {
    icon: Puzzle,
    name: 'name',
    type: 'string',
    description: t('docs.manifest.fields.name')
  },
  {
    icon: Code,
    name: 'version',
    type: 'string',
    description: t('docs.manifest.fields.version')
  },
  {
    icon: Key,
    name: 'public_key',
    type: 'string',
    description: t('docs.manifest.fields.publicKey')
  }
])

const optionalFields = computed(() => [
  {
    name: 'author',
    type: 'string | null',
    description: t('docs.manifest.fields.author')
  },
  {
    name: 'description',
    type: 'string | null',
    description: t('docs.manifest.fields.description')
  },
  {
    name: 'homepage',
    type: 'string | null',
    description: t('docs.manifest.fields.homepage')
  },
  {
    name: 'entry',
    type: 'string',
    default: '"index.html"',
    description: t('docs.manifest.fields.entry')
  },
  {
    name: 'icon',
    type: 'string',
    default: '"icon.png"',
    description: t('docs.manifest.fields.icon')
  },
  {
    name: 'display_mode',
    type: '"auto" | "window" | "iframe"',
    default: '"auto"',
    description: t('docs.manifest.fields.displayMode')
  },
  {
    name: 'single_instance',
    type: 'boolean',
    default: 'false',
    description: t('docs.manifest.fields.singleInstance')
  },
  {
    name: 'signature',
    type: 'string',
    description: t('docs.manifest.fields.signature')
  }
])

const displayModes = computed(() => [
  {
    mode: 'auto',
    description: t('docs.manifest.displayModes.auto')
  },
  {
    mode: 'window',
    description: t('docs.manifest.displayModes.window')
  },
  {
    mode: 'iframe',
    description: t('docs.manifest.displayModes.iframe')
  }
])
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <NuxtLinkLocale to="/docs" class="hover:text-foreground">{{ t('docs.title') }}</NuxtLinkLocale>
        <span>/</span>
        <NuxtLinkLocale to="/docs/extensions" class="hover:text-foreground">{{ t('docs.nav.extensions') }}</NuxtLinkLocale>
        <span>/</span>
        <span>{{ t('docs.nav.manifest') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.manifest.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.manifest.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.manifest.sections.overview.title')" :icon="FileJson">
      <p class="text-muted-foreground mb-6">{{ t('docs.manifest.sections.overview.intro') }}</p>
      <DocsCodeBlock :code="code.simpleManifest" language="json" />
    </DocsSection>

    <!-- Required Fields -->
    <DocsSection id="required-fields" :title="t('docs.manifest.sections.requiredFields.title')" :icon="Key">
      <p class="text-muted-foreground mb-6">{{ t('docs.manifest.sections.requiredFields.intro') }}</p>

      <div class="space-y-4">
        <Card v-for="field in requiredFields" :key="field.name">
          <CardContent class="pt-6">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <component :is="field.icon" class="w-5 h-5 text-primary" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <code class="text-sm font-semibold">{{ field.name }}</code>
                  <Badge variant="secondary" class="text-xs">{{ field.type }}</Badge>
                  <Badge variant="destructive" class="text-xs">{{ t('docs.manifest.required') }}</Badge>
                </div>
                <p class="text-sm text-muted-foreground">{{ field.description }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocsSection>

    <!-- Optional Fields -->
    <DocsSection id="optional-fields" :title="t('docs.manifest.sections.optionalFields.title')" :icon="Settings">
      <p class="text-muted-foreground mb-6">{{ t('docs.manifest.sections.optionalFields.intro') }}</p>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 font-medium">{{ t('docs.manifest.table.field') }}</th>
              <th class="text-left py-3 px-4 font-medium">{{ t('docs.manifest.table.type') }}</th>
              <th class="text-left py-3 px-4 font-medium">{{ t('docs.manifest.table.default') }}</th>
              <th class="text-left py-3 px-4 font-medium">{{ t('docs.manifest.table.description') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in optionalFields" :key="field.name" class="border-b last:border-0">
              <td class="py-3 px-4"><code class="text-primary">{{ field.name }}</code></td>
              <td class="py-3 px-4 text-muted-foreground font-mono text-xs">{{ field.type }}</td>
              <td class="py-3 px-4 text-muted-foreground">{{ field.default || '-' }}</td>
              <td class="py-3 px-4 text-muted-foreground">{{ field.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DocsSection>

    <!-- Display Modes -->
    <DocsSection id="display-modes" :title="t('docs.manifest.sections.displayModes.title')" :icon="Eye">
      <p class="text-muted-foreground mb-6">{{ t('docs.manifest.sections.displayModes.intro') }}</p>

      <div class="grid gap-4">
        <Card v-for="mode in displayModes" :key="mode.mode">
          <CardContent class="pt-6">
            <div class="flex items-start gap-4">
              <code class="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-mono">{{ mode.mode }}</code>
              <p class="text-sm text-muted-foreground">{{ mode.description }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocsSection>

    <!-- Permissions -->
    <DocsSection id="permissions" :title="t('docs.manifest.sections.permissions.title')" :icon="Key">
      <p class="text-muted-foreground mb-6">{{ t('docs.manifest.sections.permissions.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.manifest.sections.permissions.database') }}</h3>
      <p class="text-sm text-muted-foreground mb-3">{{ t('docs.manifest.sections.permissions.databaseDesc') }}</p>
      <DocsCodeBlock :code="code.permissionsDatabase" language="json" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.manifest.sections.permissions.filesystem') }}</h3>
      <p class="text-sm text-muted-foreground mb-3">{{ t('docs.manifest.sections.permissions.filesystemDesc') }}</p>
      <DocsCodeBlock :code="code.permissionsFilesystem" language="json" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.manifest.sections.permissions.http') }}</h3>
      <p class="text-sm text-muted-foreground mb-3">{{ t('docs.manifest.sections.permissions.httpDesc') }}</p>
      <DocsCodeBlock :code="code.permissionsHttp" language="json" />

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.manifest.sections.permissions.note') }}
        <NuxtLinkLocale to="/docs/extensions/permissions" class="underline hover:no-underline ml-1">
          {{ t('docs.manifest.sections.permissions.learnMore') }}
        </NuxtLinkLocale>
      </DocsAlert>
    </DocsSection>

    <!-- Complete Example -->
    <DocsSection id="complete-example" :title="t('docs.manifest.sections.completeExample.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.manifest.sections.completeExample.intro') }}</p>
      <DocsCodeBlock :code="code.fullManifest" language="json" />
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLinkLocale to="/docs/extensions" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.buildExtension') }}</span>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/docs/extensions/permissions" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.permissions') }}</span>
        <span>&rarr;</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
