<script setup lang="ts">
import { Shield, Database, FolderOpen, Globe, Terminal, CheckCircle, XCircle, HelpCircle } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.permissions.toc.overview'), level: 2 },
  { id: 'permission-types', title: t('docs.permissions.toc.permissionTypes'), level: 2 },
  { id: 'database-permissions', title: t('docs.permissions.toc.database'), level: 3 },
  { id: 'filesystem-permissions', title: t('docs.permissions.toc.filesystem'), level: 3 },
  { id: 'http-permissions', title: t('docs.permissions.toc.http'), level: 3 },
  { id: 'checking-permissions', title: t('docs.permissions.toc.checking'), level: 2 },
  { id: 'requesting-permissions', title: t('docs.permissions.toc.requesting'), level: 2 },
  { id: 'best-practices', title: t('docs.permissions.toc.bestPractices'), level: 2 },
]

const code = {
  manifestPermissions: `{
  "permissions": {
    "database": [
      { "target": "users", "operation": "read_write" },
      { "target": "logs", "operation": "read" }
    ],
    "filesystem": [
      { "target": "exports/**", "operation": "read_write" }
    ],
    "http": [
      { "target": "https://api.example.com/**" }
    ],
    "shell": null
  }
}`,

  databasePermissions: `// Read-only access to a specific table
{ "target": "users", "operation": "read" }

// Full access to a specific table
{ "target": "settings", "operation": "read_write" }

// Read access to all tables (use sparingly)
{ "target": "*", "operation": "read" }`,

  filesystemPermissions: `// Read text files anywhere
{ "target": "**/*.txt", "operation": "read" }

// Read and write in a specific directory
{ "target": "exports/**", "operation": "read_write" }

// Full access to JSON files in documents
{ "target": "documents/*.json", "operation": "read_write" }`,

  httpPermissions: `// All endpoints on a specific API
{ "target": "https://api.example.com/**" }

// Specific path pattern
{ "target": "https://api.github.com/users/*/repos" }

// Multiple subdomains
{ "target": "https://*.example.com/api/*" }`,

  checkPermission: `import { useHaexClient } from '@haex-space/vault-sdk/vue'

const client = useHaexClient()

// Check database permission
const canReadUsers = await client.checkDatabaseAsync('users', 'read')
const canWriteUsers = await client.checkDatabaseAsync('users', 'write')

// Check filesystem permission
const canReadExports = await client.checkFilesystemAsync('exports/', 'read')

// Check HTTP permission
const canFetchApi = await client.checkWebAsync('https://api.example.com/data')

// Use in conditional logic
if (canWriteUsers) {
  await client.insert('users', { name: 'John', email: 'john@example.com' })
} else {
  console.warn('No write permission for users table')
}`,

  requestPermission: `import { useHaexClient } from '@haex-space/vault-sdk/vue'

const client = useHaexClient()

// Request permission with reason
const response = await client.requestDatabasePermission(
  'users',
  'write',
  'Required to save your profile changes'
)

if (response.status === 'granted') {
  // Permission granted, proceed with operation
  await client.insert('users', userData)
} else if (response.status === 'denied') {
  // User denied permission
  showError('Permission denied. Cannot save data.')
} else if (response.status === 'ask') {
  // System will show permission dialog
  // Handle async response
}`,

  permissionStatus: `// Permission status values
enum PermissionStatus {
  GRANTED = 'granted',  // Permission is granted
  DENIED = 'denied',    // Permission was denied
  ASK = 'ask'           // Will prompt user
}

interface PermissionResponse {
  status: PermissionStatus
  permanent: boolean  // If true, won't ask again
}`
}

const permissionTypes = computed(() => [
  {
    icon: Database,
    name: t('docs.permissions.types.database.name'),
    description: t('docs.permissions.types.database.description'),
    operations: ['read', 'read_write']
  },
  {
    icon: FolderOpen,
    name: t('docs.permissions.types.filesystem.name'),
    description: t('docs.permissions.types.filesystem.description'),
    operations: ['read', 'read_write']
  },
  {
    icon: Globe,
    name: t('docs.permissions.types.http.name'),
    description: t('docs.permissions.types.http.description'),
    operations: ['(target only)']
  },
  {
    icon: Terminal,
    name: t('docs.permissions.types.shell.name'),
    description: t('docs.permissions.types.shell.description'),
    operations: ['execute']
  }
])

const bestPractices = computed(() => [
  {
    title: t('docs.permissions.bestPractices.minimal.title'),
    description: t('docs.permissions.bestPractices.minimal.description')
  },
  {
    title: t('docs.permissions.bestPractices.specific.title'),
    description: t('docs.permissions.bestPractices.specific.description')
  },
  {
    title: t('docs.permissions.bestPractices.explain.title'),
    description: t('docs.permissions.bestPractices.explain.description')
  },
  {
    title: t('docs.permissions.bestPractices.graceful.title'),
    description: t('docs.permissions.bestPractices.graceful.description')
  }
])
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <!-- Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <NuxtLink to="/docs" class="hover:text-foreground">{{ t('docs.title') }}</NuxtLink>
        <span>/</span>
        <NuxtLink to="/docs/extensions" class="hover:text-foreground">{{ t('docs.nav.extensions') }}</NuxtLink>
        <span>/</span>
        <span>{{ t('docs.nav.permissions') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.permissions.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.permissions.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.permissions.sections.overview.title')" :icon="Shield">
      <p class="text-muted-foreground mb-6">{{ t('docs.permissions.sections.overview.intro') }}</p>

      <div class="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent class="pt-6 text-center">
            <CheckCircle class="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p class="font-medium">{{ t('docs.permissions.status.granted') }}</p>
            <p class="text-sm text-muted-foreground">{{ t('docs.permissions.status.grantedDesc') }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6 text-center">
            <XCircle class="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p class="font-medium">{{ t('docs.permissions.status.denied') }}</p>
            <p class="text-sm text-muted-foreground">{{ t('docs.permissions.status.deniedDesc') }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6 text-center">
            <HelpCircle class="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p class="font-medium">{{ t('docs.permissions.status.ask') }}</p>
            <p class="text-sm text-muted-foreground">{{ t('docs.permissions.status.askDesc') }}</p>
          </CardContent>
        </Card>
      </div>

      <DocsCodeBlock :code="code.manifestPermissions" language="json" />
    </DocsSection>

    <!-- Permission Types -->
    <DocsSection id="permission-types" :title="t('docs.permissions.sections.types.title')">
      <div class="grid md:grid-cols-2 gap-4 mb-8">
        <Card v-for="type in permissionTypes" :key="type.name">
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <component :is="type.icon" class="w-4 h-4 text-primary" />
              {{ type.name }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-2">{{ type.description }}</p>
            <div class="flex gap-2">
              <Badge v-for="op in type.operations" :key="op" variant="secondary" class="text-xs">
                {{ op }}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Database Permissions -->
      <div id="database-permissions" class="mb-8">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database class="w-5 h-5 text-primary" />
          {{ t('docs.permissions.sections.database.title') }}
        </h3>
        <p class="text-muted-foreground mb-4">{{ t('docs.permissions.sections.database.intro') }}</p>

        <DocsAlert type="info" class="mb-4">
          {{ t('docs.permissions.sections.database.ownTablesNote') }}
        </DocsAlert>

        <DocsCodeBlock :code="code.databasePermissions" language="javascript" />
      </div>

      <!-- Filesystem Permissions -->
      <div id="filesystem-permissions" class="mb-8">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <FolderOpen class="w-5 h-5 text-primary" />
          {{ t('docs.permissions.sections.filesystem.title') }}
        </h3>
        <p class="text-muted-foreground mb-4">{{ t('docs.permissions.sections.filesystem.intro') }}</p>
        <DocsCodeBlock :code="code.filesystemPermissions" language="javascript" />

        <DocsAlert type="info" class="mt-4">
          {{ t('docs.permissions.sections.filesystem.note') }}
        </DocsAlert>
      </div>

      <!-- HTTP Permissions -->
      <div id="http-permissions">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe class="w-5 h-5 text-primary" />
          {{ t('docs.permissions.sections.http.title') }}
        </h3>
        <p class="text-muted-foreground mb-4">{{ t('docs.permissions.sections.http.intro') }}</p>
        <DocsCodeBlock :code="code.httpPermissions" language="javascript" />

        <div class="mt-4 p-4 bg-muted rounded-lg">
          <h4 class="font-medium mb-2">{{ t('docs.permissions.sections.http.patterns') }}</h4>
          <ul class="text-sm text-muted-foreground space-y-1">
            <li><code class="text-primary">**</code> - {{ t('docs.permissions.sections.http.patternMultiple') }}</li>
            <li><code class="text-primary">*</code> - {{ t('docs.permissions.sections.http.patternSingle') }}</li>
          </ul>
        </div>
      </div>
    </DocsSection>

    <!-- Checking Permissions -->
    <DocsSection id="checking-permissions" :title="t('docs.permissions.sections.checking.title')" :icon="CheckCircle">
      <p class="text-muted-foreground mb-6">{{ t('docs.permissions.sections.checking.intro') }}</p>
      <DocsCodeBlock :code="code.checkPermission" language="typescript" />
    </DocsSection>

    <!-- Requesting Permissions -->
    <DocsSection id="requesting-permissions" :title="t('docs.permissions.sections.requesting.title')" :icon="HelpCircle">
      <p class="text-muted-foreground mb-6">{{ t('docs.permissions.sections.requesting.intro') }}</p>
      <DocsCodeBlock :code="code.requestPermission" language="typescript" class="mb-6" />

      <h4 class="font-medium mb-3">{{ t('docs.permissions.sections.requesting.statusTitle') }}</h4>
      <DocsCodeBlock :code="code.permissionStatus" language="typescript" />
    </DocsSection>

    <!-- Best Practices -->
    <DocsSection id="best-practices" :title="t('docs.permissions.sections.bestPractices.title')" :icon="Shield">
      <div class="space-y-4">
        <Card v-for="(practice, index) in bestPractices" :key="index">
          <CardContent class="pt-6">
            <h4 class="font-medium mb-2">{{ practice.title }}</h4>
            <p class="text-sm text-muted-foreground">{{ practice.description }}</p>
          </CardContent>
        </Card>
      </div>

      <DocsAlert type="warning" class="mt-6">
        {{ t('docs.permissions.sections.bestPractices.warning') }}
      </DocsAlert>
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLink to="/docs/extensions/manifest" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.manifest') }}</span>
      </NuxtLink>
      <NuxtLink to="/docs/extensions/database" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.database') }}</span>
        <span>&rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>
