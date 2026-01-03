<script setup lang="ts">
import { Database, Server, Table, Key, ChevronRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

useSeoMeta({
  title: 'Database Schema - Architecture - haex.space',
  description: 'Complete database schema documentation for haex-vault. SQLite tables, CRDT columns, and sync server schema.',
})

const tableOfContents = useState<Array<{ id: string; title: string; level?: number }>>('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.dbSchema.toc.overview'), level: 2 },
  { id: 'crdt-columns', title: t('docs.dbSchema.toc.crdtColumns'), level: 2 },
  { id: 'core-tables', title: t('docs.dbSchema.toc.coreTables'), level: 2 },
  { id: 'crdt-infrastructure', title: t('docs.dbSchema.toc.crdtInfra'), level: 2 },
  { id: 'extension-tables', title: t('docs.dbSchema.toc.extensionTables'), level: 2 },
  { id: 'sync-server', title: t('docs.dbSchema.toc.syncServer'), level: 2 },
  { id: 'triggers', title: t('docs.dbSchema.toc.triggers'), level: 2 },
]

const coreTables = [
  { name: 'haex_vault_settings', description: t('docs.dbSchema.tables.vaultSettings'), crdt: true },
  { name: 'haex_extensions', description: t('docs.dbSchema.tables.extensions'), crdt: true },
  { name: 'haex_extension_permissions', description: t('docs.dbSchema.tables.permissions'), crdt: true },
  { name: 'haex_extension_migrations', description: t('docs.dbSchema.tables.migrations'), crdt: true },
  { name: 'haex_workspaces', description: t('docs.dbSchema.tables.workspaces'), crdt: true },
  { name: 'haex_desktop_items', description: t('docs.dbSchema.tables.desktopItems'), crdt: true },
  { name: 'haex_devices', description: t('docs.dbSchema.tables.devices'), crdt: true },
  { name: 'haex_sync_backends', description: t('docs.dbSchema.tables.syncBackends'), crdt: true },
  { name: 'haex_notifications', description: t('docs.dbSchema.tables.notifications'), crdt: true },
]

const crdtTables = [
  { name: 'haex_crdt_dirty_tables', description: t('docs.dbSchema.crdtTables.dirtyTables'), crdt: false },
  { name: 'haex_crdt_migrations', description: t('docs.dbSchema.crdtTables.migrations'), crdt: false },
  { name: 'haex_crdt_conflicts', description: t('docs.dbSchema.crdtTables.conflicts'), crdt: false },
]

// Content paths for code examples
const paths = {
  crdtColumnsExample: '/architecture/crdt-columns-example',
  syncBackendsSchema: '/architecture/sync-backends-schema',
  dirtyTablesSchema: '/architecture/dirty-tables-schema',
  extensionTableNaming: '/architecture/extension-table-naming',
  vaultKeysSchema: '/architecture/vault-keys-schema',
  syncChangesSchema: '/architecture/sync-changes-schema',
  triggersExample: '/architecture/triggers-example',
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <NuxtLinkLocale to="/docs" class="hover:text-foreground">{{ t('docs.nav.gettingStarted') }}</NuxtLinkLocale>
        <ChevronRight class="w-4 h-4" />
        <NuxtLinkLocale to="/docs/architecture" class="hover:text-foreground">{{ t('docs.architecture.title') }}</NuxtLinkLocale>
        <ChevronRight class="w-4 h-4" />
        <span>{{ t('docs.dbSchema.title') }}</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ t('docs.dbSchema.title') }}</h1>
      <p class="text-lg text-muted-foreground">
        {{ t('docs.dbSchema.subtitle') }}
      </p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.dbSchema.sections.overview.title')" :icon="Database">
      <p class="text-muted-foreground leading-relaxed mb-6">
        {{ t('docs.dbSchema.sections.overview.intro') }}
      </p>

      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <Database class="w-4 h-4 text-primary" />
              {{ t('docs.dbSchema.sections.overview.local.title') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ t('docs.dbSchema.sections.overview.local.description') }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <Server class="w-4 h-4 text-primary" />
              {{ t('docs.dbSchema.sections.overview.server.title') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ t('docs.dbSchema.sections.overview.server.description') }}</p>
          </CardContent>
        </Card>
      </div>
    </DocsSection>

    <!-- CRDT Columns -->
    <DocsSection id="crdt-columns" :title="t('docs.dbSchema.sections.crdtColumns.title')" :icon="Table">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.dbSchema.sections.crdtColumns.intro') }}
      </p>

      <Card class="mb-6">
        <CardContent class="pt-6">
          <pre class="text-sm leading-relaxed overflow-x-auto"><code>-- {{ t('docs.dbSchema.sections.crdtColumns.comment') }}
haex_timestamp TEXT NOT NULL,      -- {{ t('docs.dbSchema.sections.crdtColumns.timestamp') }}
haex_column_hlcs TEXT NOT NULL     -- {{ t('docs.dbSchema.sections.crdtColumns.columnHlcs') }}
                 DEFAULT '{}',
haex_tombstone INTEGER NOT NULL    -- {{ t('docs.dbSchema.sections.crdtColumns.tombstone') }}
                 DEFAULT 0</code></pre>
        </CardContent>
      </Card>

      <h3 class="font-semibold mb-4">{{ t('docs.dbSchema.sections.crdtColumns.example.title') }}</h3>
      <DocsCodeBlock :path="paths.crdtColumnsExample" />
    </DocsSection>

    <!-- Core Tables -->
    <DocsSection id="core-tables" :title="t('docs.dbSchema.sections.coreTables.title')" :icon="Table">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.dbSchema.sections.coreTables.intro') }}
      </p>

      <Card>
        <CardContent class="pt-6">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 pr-4">{{ t('docs.dbSchema.sections.coreTables.table.name') }}</th>
                  <th class="text-left py-2 px-4">{{ t('docs.dbSchema.sections.coreTables.table.description') }}</th>
                  <th class="text-center py-2 pl-4">CRDT</th>
                </tr>
              </thead>
              <tbody class="text-muted-foreground">
                <tr v-for="table in coreTables" :key="table.name" class="border-b last:border-0">
                  <td class="py-2 pr-4 font-mono text-primary">{{ table.name }}</td>
                  <td class="py-2 px-4">{{ table.description }}</td>
                  <td class="py-2 pl-4 text-center">
                    <Badge v-if="table.crdt" variant="default" class="bg-green-500/10 text-green-600">Yes</Badge>
                    <Badge v-else variant="secondary">No</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <h3 class="font-semibold mt-8 mb-4">haex_sync_backends</h3>
      <DocsCodeBlock :path="paths.syncBackendsSchema" />
    </DocsSection>

    <!-- CRDT Infrastructure -->
    <DocsSection id="crdt-infrastructure" :title="t('docs.dbSchema.sections.crdtInfra.title')" :icon="Database">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.dbSchema.sections.crdtInfra.intro') }}
      </p>

      <Card class="mb-6">
        <CardContent class="pt-6">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 pr-4">{{ t('docs.dbSchema.sections.coreTables.table.name') }}</th>
                  <th class="text-left py-2 px-4">{{ t('docs.dbSchema.sections.coreTables.table.description') }}</th>
                  <th class="text-center py-2 pl-4">{{ t('docs.dbSchema.sections.crdtInfra.synced') }}</th>
                </tr>
              </thead>
              <tbody class="text-muted-foreground">
                <tr v-for="table in crdtTables" :key="table.name" class="border-b last:border-0">
                  <td class="py-2 pr-4 font-mono text-primary">{{ table.name }}</td>
                  <td class="py-2 px-4">{{ table.description }}</td>
                  <td class="py-2 pl-4 text-center">
                    <Badge variant="secondary">{{ t('docs.dbSchema.sections.crdtInfra.localOnly') }}</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <h3 class="font-semibold mb-4">haex_crdt_dirty_tables</h3>
      <DocsCodeBlock :path="paths.dirtyTablesSchema" />
    </DocsSection>

    <!-- Extension Tables -->
    <DocsSection id="extension-tables" :title="t('docs.dbSchema.sections.extensionTables.title')" :icon="Table">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.dbSchema.sections.extensionTables.intro') }}
      </p>

      <DocsCodeBlock :path="paths.extensionTableNaming" class="mb-6" />

      <DocsAlert type="info" :title="t('docs.dbSchema.sections.extensionTables.auto.title')">
        {{ t('docs.dbSchema.sections.extensionTables.auto.description') }}
      </DocsAlert>
    </DocsSection>

    <!-- Sync Server Schema -->
    <DocsSection id="sync-server" :title="t('docs.dbSchema.sections.syncServer.title')" :icon="Server">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.dbSchema.sections.syncServer.intro') }}
      </p>

      <h3 class="font-semibold mb-4">vault_keys</h3>
      <DocsCodeBlock :path="paths.vaultKeysSchema" class="mb-6" />

      <h3 class="font-semibold mb-4">sync_changes ({{ t('docs.dbSchema.sections.syncServer.partitioned') }})</h3>
      <DocsCodeBlock :path="paths.syncChangesSchema" class="mb-6" />

      <DocsAlert type="warning" :title="t('docs.dbSchema.sections.syncServer.rls.title')">
        {{ t('docs.dbSchema.sections.syncServer.rls.description') }}
      </DocsAlert>
    </DocsSection>

    <!-- Triggers -->
    <DocsSection id="triggers" :title="t('docs.dbSchema.sections.triggers.title')" :icon="Key">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.dbSchema.sections.triggers.intro') }}
      </p>

      <DocsCodeBlock :path="paths.triggersExample" class="mb-6" />

      <DocsAlert type="info" :title="t('docs.dbSchema.sections.triggers.auto.title')">
        {{ t('docs.dbSchema.sections.triggers.auto.description') }}
      </DocsAlert>
    </DocsSection>

    <!-- Next Links -->
    <div class="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t mt-12">
      <NuxtLinkLocale to="/docs/architecture/extensions" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.extArch.title') }}</span>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/docs/extensions" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.buildExtension') }}</span>
        <span>&rarr;</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
