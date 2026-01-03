<script setup lang="ts">
import { Puzzle, Shield, Database, Monitor, Smartphone, Code, Zap, ChevronRight, RefreshCw } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

useSeoMeta({
  title: 'Extension System Architecture - haex.space',
  description: 'Deep dive into the haex-vault extension system. Learn about sandboxing, permissions, iframe vs WebView, and the extension lifecycle.',
})

const tableOfContents = useState<Array<{ id: string; title: string; level?: number }>>('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.extArch.toc.overview'), level: 2 },
  { id: 'display-modes', title: t('docs.extArch.toc.displayModes'), level: 2 },
  { id: 'lifecycle', title: t('docs.extArch.toc.lifecycle'), level: 2 },
  { id: 'permissions', title: t('docs.extArch.toc.permissions'), level: 2 },
  { id: 'communication', title: t('docs.extArch.toc.communication'), level: 2 },
  { id: 'dev-mode', title: t('docs.extArch.toc.devMode'), level: 2 },
  { id: 'sync-events', title: t('docs.extArch.toc.syncEvents'), level: 2 },
]

// Content paths for code examples
const paths = {
  displayModeManifest: '/architecture/display-mode-manifest',
  permissionModel: '/architecture/permission-model',
  permissionEnforcement: '/architecture/permission-enforcement',
  iframeCommunication: '/architecture/iframe-communication',
  webviewCommunication: '/architecture/webview-communication',
  extSyncEventListener: '/architecture/ext-sync-event-listener',
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
        <span>{{ t('docs.extArch.title') }}</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ t('docs.extArch.title') }}</h1>
      <p class="text-lg text-muted-foreground">
        {{ t('docs.extArch.subtitle') }}
      </p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.extArch.sections.overview.title')" :icon="Puzzle">
      <p class="text-muted-foreground leading-relaxed mb-6">
        {{ t('docs.extArch.sections.overview.intro') }}
      </p>

      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <Shield class="w-4 h-4 text-primary" />
              {{ t('docs.extArch.sections.overview.features.sandbox.title') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ t('docs.extArch.sections.overview.features.sandbox.description') }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <Code class="w-4 h-4 text-primary" />
              {{ t('docs.extArch.sections.overview.features.sdk.title') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ t('docs.extArch.sections.overview.features.sdk.description') }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <Database class="w-4 h-4 text-primary" />
              {{ t('docs.extArch.sections.overview.features.database.title') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ t('docs.extArch.sections.overview.features.database.description') }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <RefreshCw class="w-4 h-4 text-primary" />
              {{ t('docs.extArch.sections.overview.features.sync.title') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ t('docs.extArch.sections.overview.features.sync.description') }}</p>
          </CardContent>
        </Card>
      </div>
    </DocsSection>

    <!-- Display Modes -->
    <DocsSection id="display-modes" :title="t('docs.extArch.sections.displayModes.title')" :icon="Monitor">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.extArch.sections.displayModes.intro') }}
      </p>

      <Card class="mb-6">
        <CardContent class="pt-6">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 pr-4">{{ t('docs.extArch.sections.displayModes.table.aspect') }}</th>
                  <th class="text-left py-2 px-4">
                    <div class="flex items-center gap-2">
                      <Monitor class="w-4 h-4" />
                      iframe
                    </div>
                  </th>
                  <th class="text-left py-2 pl-4">
                    <div class="flex items-center gap-2">
                      <Smartphone class="w-4 h-4" />
                      WebView
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="text-muted-foreground">
                <tr class="border-b">
                  <td class="py-2 pr-4 font-medium">{{ t('docs.extArch.sections.displayModes.table.platform') }}</td>
                  <td class="py-2 px-4">Desktop</td>
                  <td class="py-2 pl-4">Mobile (Android/iOS)</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-medium">{{ t('docs.extArch.sections.displayModes.table.isolation') }}</td>
                  <td class="py-2 px-4">Browser Sandbox</td>
                  <td class="py-2 pl-4">Process Isolation</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-medium">{{ t('docs.extArch.sections.displayModes.table.communication') }}</td>
                  <td class="py-2 px-4">postMessage API</td>
                  <td class="py-2 pl-4">Tauri Events</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-medium">{{ t('docs.extArch.sections.displayModes.table.debugging') }}</td>
                  <td class="py-2 px-4">DevTools</td>
                  <td class="py-2 pl-4">Native Debugger</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4 font-medium">{{ t('docs.extArch.sections.displayModes.table.performance') }}</td>
                  <td class="py-2 px-4">Lightweight</td>
                  <td class="py-2 pl-4">Heavier</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <h3 class="font-semibold mb-4">{{ t('docs.extArch.sections.displayModes.manifest.title') }}</h3>
      <DocsCodeBlock :path="paths.displayModeManifest" />
    </DocsSection>

    <!-- Lifecycle -->
    <DocsSection id="lifecycle" :title="t('docs.extArch.sections.lifecycle.title')" :icon="Zap">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.extArch.sections.lifecycle.intro') }}
      </p>

      <Card class="mb-6">
        <CardContent class="pt-6">
          <pre class="text-xs md:text-sm leading-relaxed overflow-x-auto"><code>┌─────────────────────────────────────────────────────────────┐
│                    Extension Installation                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│   1. preview_extension(fileBytes)                            │
│      - Extract ZIP to temp dir                              │
│      - Validate manifest.json                               │
│      - Verify public_key & signature                        │
│      - Return ExtensionPreview for user review              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│   2. User reviews & grants permissions                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│   3. install_extension_with_permissions()                    │
│      - INSERT into haex_extensions (CRDT)                   │
│      - INSERT into haex_extension_permissions               │
│      - Extract ZIP to app_data_dir/extensions/              │
│      - Load into ExtensionManager (memory)                  │
│      - Run database migrations (CREATE TABLE with CRDT)     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│   4. Extension ready                                         │
│      - Tables synced via CRDT                               │
│      - User can open extension                              │
└─────────────────────────────────────────────────────────────┘</code></pre>
        </CardContent>
      </Card>

      <DocsAlert type="info" :title="t('docs.extArch.sections.lifecycle.sync.title')">
        {{ t('docs.extArch.sections.lifecycle.sync.description') }}
      </DocsAlert>
    </DocsSection>

    <!-- Permissions -->
    <DocsSection id="permissions" :title="t('docs.extArch.sections.permissions.title')" :icon="Shield">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.extArch.sections.permissions.intro') }}
      </p>

      <DocsCodeBlock :path="paths.permissionModel" class="mb-6" />

      <h3 class="font-semibold mb-4">{{ t('docs.extArch.sections.permissions.types.title') }}</h3>
      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Database</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-sm text-muted-foreground space-y-1">
              <li><code class="text-primary">read</code> - SELECT only</li>
              <li><code class="text-primary">readWrite</code> - SELECT + INSERT/UPDATE</li>
              <li><code class="text-primary">create</code> - CREATE TABLE</li>
              <li><code class="text-primary">delete</code> - DELETE rows</li>
              <li><code class="text-primary">alterDrop</code> - ALTER/DROP</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Filesystem</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-sm text-muted-foreground space-y-1">
              <li><code class="text-primary">read</code> - Read files</li>
              <li><code class="text-primary">readWrite</code> - Read + Write files</li>
              <li><code class="text-primary">delete</code> - Delete files</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <h3 class="font-semibold mb-4">{{ t('docs.extArch.sections.permissions.enforcement.title') }}</h3>
      <DocsCodeBlock :path="paths.permissionEnforcement" />
    </DocsSection>

    <!-- Communication -->
    <DocsSection id="communication" :title="t('docs.extArch.sections.communication.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.extArch.sections.communication.intro') }}
      </p>

      <h3 class="font-semibold mb-4">{{ t('docs.extArch.sections.communication.iframe.title') }}</h3>
      <DocsCodeBlock :path="paths.iframeCommunication" class="mb-6" />

      <h3 class="font-semibold mb-4">{{ t('docs.extArch.sections.communication.webview.title') }}</h3>
      <DocsCodeBlock :path="paths.webviewCommunication" />
    </DocsSection>

    <!-- Dev Mode -->
    <DocsSection id="dev-mode" :title="t('docs.extArch.sections.devMode.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.extArch.sections.devMode.intro') }}
      </p>

      <div class="space-y-4 mb-6">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">{{ t('docs.extArch.sections.devMode.features.hotReload.title') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ t('docs.extArch.sections.devMode.features.hotReload.description') }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">{{ t('docs.extArch.sections.devMode.features.localOnly.title') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ t('docs.extArch.sections.devMode.features.localOnly.description') }}</p>
          </CardContent>
        </Card>
      </div>

      <DocsAlert type="warning" :title="t('docs.extArch.sections.devMode.important.title')">
        {{ t('docs.extArch.sections.devMode.important.description') }}
      </DocsAlert>
    </DocsSection>

    <!-- Sync Events -->
    <DocsSection id="sync-events" :title="t('docs.extArch.sections.syncEvents.title')" :icon="RefreshCw">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.extArch.sections.syncEvents.intro') }}
      </p>

      <DocsCodeBlock :path="paths.extSyncEventListener" class="mb-6" />

      <DocsAlert type="info" :title="t('docs.extArch.sections.syncEvents.automatic.title')">
        {{ t('docs.extArch.sections.syncEvents.automatic.description') }}
      </DocsAlert>
    </DocsSection>

    <!-- Next Links -->
    <div class="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t mt-12">
      <NuxtLinkLocale to="/docs/architecture/sync" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.sync.title') }}</span>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/docs/architecture/database" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.architecture.nav.database') }}</span>
        <span>&rarr;</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
