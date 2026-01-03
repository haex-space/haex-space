<script setup lang="ts">
import { Database, Server, Table, Key, Shield, ChevronRight } from 'lucide-vue-next'

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
      <Card>
        <CardContent class="pt-6">
          <pre class="text-sm leading-relaxed overflow-x-auto"><code>-- {{ t('docs.dbSchema.sections.crdtColumns.example.comment') }}
SELECT
  id,
  title,
  haex_timestamp,
  haex_column_hlcs,
  haex_tombstone
FROM haex_passwords
WHERE id = 'abc-123';

-- Result:
-- id: "abc-123"
-- title: "Gmail"
-- haex_timestamp: "2024-01-03T10:45:30.200-B"
-- haex_column_hlcs: '{"id":"2024-01-03T10:00:00.000-A","title":"2024-01-03T10:45:30.200-B"}'
-- haex_tombstone: 0</code></pre>
        </CardContent>
      </Card>
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
      <Card>
        <CardContent class="pt-6">
          <pre class="text-sm leading-relaxed overflow-x-auto"><code>CREATE TABLE haex_sync_backends (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  server_url TEXT NOT NULL,
  vault_id TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,           -- {{ t('docs.dbSchema.syncBackends.password') }}
  sync_key TEXT NOT NULL,           -- {{ t('docs.dbSchema.syncBackends.syncKey') }}
  vault_key_salt TEXT NOT NULL,     -- {{ t('docs.dbSchema.syncBackends.vaultKeySalt') }}
  enabled INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 0,
  last_push_hlc_timestamp TEXT,     -- {{ t('docs.dbSchema.syncBackends.lastPush') }}
  last_pull_server_timestamp TEXT,  -- {{ t('docs.dbSchema.syncBackends.lastPull') }}
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

  -- CRDT columns
  haex_timestamp TEXT NOT NULL,
  haex_column_hlcs TEXT NOT NULL DEFAULT '{}',
  haex_tombstone INTEGER NOT NULL DEFAULT 0
);</code></pre>
        </CardContent>
      </Card>
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
      <Card>
        <CardContent class="pt-6">
          <pre class="text-sm leading-relaxed overflow-x-auto"><code>-- {{ t('docs.dbSchema.dirtyTables.comment') }}
CREATE TABLE haex_crdt_dirty_tables (
  table_name TEXT PRIMARY KEY,
  last_modified TEXT NOT NULL
);

-- {{ t('docs.dbSchema.dirtyTables.example') }}
-- table_name: "haex_passwords"
-- last_modified: "2024-01-03 10:45:30"</code></pre>
        </CardContent>
      </Card>
    </DocsSection>

    <!-- Extension Tables -->
    <DocsSection id="extension-tables" :title="t('docs.dbSchema.sections.extensionTables.title')" :icon="Table">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.dbSchema.sections.extensionTables.intro') }}
      </p>

      <Card class="mb-6">
        <CardContent class="pt-6">
          <pre class="text-sm leading-relaxed overflow-x-auto"><code>-- {{ t('docs.dbSchema.sections.extensionTables.naming') }}
{public_key}__{extension_name}__{table_name}

-- {{ t('docs.dbSchema.sections.extensionTables.example') }}
b4401f13f65e576b__haex-pass__haex_passwords_items
b4401f13f65e576b__haex-pass__haex_passwords_groups</code></pre>
        </CardContent>
      </Card>

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
      <Card class="mb-6">
        <CardContent class="pt-6">
          <pre class="text-sm leading-relaxed overflow-x-auto"><code>CREATE TABLE vault_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vault_id TEXT NOT NULL,
  encrypted_vault_key TEXT NOT NULL,   -- {{ t('docs.dbSchema.vaultKeys.encryptedKey') }}
  encrypted_vault_name TEXT NOT NULL,  -- {{ t('docs.dbSchema.vaultKeys.encryptedName') }}
  vault_key_salt TEXT NOT NULL,        -- {{ t('docs.dbSchema.vaultKeys.keySalt') }}
  vault_name_salt TEXT NOT NULL,       -- {{ t('docs.dbSchema.vaultKeys.nameSalt') }}
  vault_key_nonce TEXT NOT NULL,
  vault_name_nonce TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, vault_id)
);</code></pre>
        </CardContent>
      </Card>

      <h3 class="font-semibold mb-4">sync_changes ({{ t('docs.dbSchema.sections.syncServer.partitioned') }})</h3>
      <Card class="mb-6">
        <CardContent class="pt-6">
          <pre class="text-sm leading-relaxed overflow-x-auto"><code>CREATE TABLE sync_changes (
  vault_id TEXT NOT NULL,
  table_name TEXT NOT NULL,
  row_pks JSONB NOT NULL,            -- {{ t('docs.dbSchema.syncChanges.rowPks') }}
  column_name TEXT NOT NULL,
  new_value BYTEA,                   -- {{ t('docs.dbSchema.syncChanges.newValue') }}
  hlc_timestamp TEXT NOT NULL,
  device_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (vault_id, hlc_timestamp, table_name, row_pks, column_name)
) PARTITION BY LIST (vault_id);

-- {{ t('docs.dbSchema.syncChanges.partition') }}
-- sync_changes_abc123_def456_...
-- {{ t('docs.dbSchema.syncChanges.autoCreated') }}</code></pre>
        </CardContent>
      </Card>

      <DocsAlert type="warning" :title="t('docs.dbSchema.sections.syncServer.rls.title')">
        {{ t('docs.dbSchema.sections.syncServer.rls.description') }}
      </DocsAlert>
    </DocsSection>

    <!-- Triggers -->
    <DocsSection id="triggers" :title="t('docs.dbSchema.sections.triggers.title')" :icon="Key">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.dbSchema.sections.triggers.intro') }}
      </p>

      <Card class="mb-6">
        <CardContent class="pt-6">
          <pre class="text-sm leading-relaxed overflow-x-auto"><code>-- {{ t('docs.dbSchema.sections.triggers.naming') }}
z_dirty_{TABLE_NAME}_{insert|update}

-- {{ t('docs.dbSchema.sections.triggers.example') }}
CREATE TRIGGER IF NOT EXISTS "z_dirty_haex_passwords_insert"
AFTER INSERT ON "haex_passwords"
FOR EACH ROW BEGIN
  INSERT OR REPLACE INTO haex_crdt_dirty_tables
  (table_name, last_modified)
  VALUES ('haex_passwords', datetime('now'));
END;

CREATE TRIGGER IF NOT EXISTS "z_dirty_haex_passwords_update"
AFTER UPDATE ON "haex_passwords"
FOR EACH ROW BEGIN
  INSERT OR REPLACE INTO haex_crdt_dirty_tables
  (table_name, last_modified)
  VALUES ('haex_passwords', datetime('now'));
END;</code></pre>
        </CardContent>
      </Card>

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
