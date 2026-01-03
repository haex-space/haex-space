<script setup lang="ts">
import { RefreshCw, Database, Clock, Zap, Shield, ChevronRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

useSeoMeta({
  title: 'Sync & CRDT System - Architecture - haex.space',
  description: 'Learn how haex-vault synchronizes data across devices using Column-Level CRDTs and Hybrid Logical Clocks.',
})

const tableOfContents = useState<Array<{ id: string; title: string; level?: number }>>('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.sync.toc.overview'), level: 2 },
  { id: 'crdt-basics', title: t('docs.sync.toc.crdtBasics'), level: 2 },
  { id: 'hlc', title: t('docs.sync.toc.hlc'), level: 2 },
  { id: 'column-level', title: t('docs.sync.toc.columnLevel'), level: 2 },
  { id: 'sync-flow', title: t('docs.sync.toc.syncFlow'), level: 2 },
  { id: 'push', title: t('docs.sync.toc.push'), level: 3 },
  { id: 'pull', title: t('docs.sync.toc.pull'), level: 3 },
  { id: 'realtime', title: t('docs.sync.toc.realtime'), level: 2 },
  { id: 'soft-delete', title: t('docs.sync.toc.softDelete'), level: 2 },
  { id: 'events', title: t('docs.sync.toc.events'), level: 2 },
]

// Content paths for code examples
const paths = {
  crdtColumns: '/architecture/crdt-columns',
  hlcFormat: '/architecture/hlc-format',
  columnHlcJson: '/architecture/column-hlc-json',
  conflictExample: '/architecture/conflict-example',
  pushStructure: '/architecture/push-structure',
  pullLogic: '/architecture/pull-logic',
  realtimeSubscription: '/architecture/realtime-subscription',
  softDelete: '/architecture/soft-delete',
  syncEventListener: '/architecture/sync-event-listener',
}

const syncFlowDiagram = `┌─────────────────────────────────────────────────────────────┐
│                    USER MAKES CHANGE                         │
│              (Insert/Update/Delete Row)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│   SQLite Trigger fires                                       │
│   → Entry added to haex_crdt_dirty_tables                   │
│   → Rust emits 'crdt:dirty-tables-changed' event            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│   Sync Orchestrator (debounced 300ms)                        │
│   → Scans dirty tables for changes since last push          │
│   → Generates column-level changes                          │
│   → Encrypts each value with vault key                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│   POST /sync/push → haex-sync-server                         │
│   → UPSERT into sync_changes (partitioned by vault_id)      │
│   → HLC comparison: only store if new HLC > existing        │
│   → Trigger Supabase Realtime notification                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│   Other devices receive Realtime event                       │
│   → Trigger debounced pull                                  │
│   → GET /sync/pull?afterUpdatedAt=lastPullTimestamp         │
│   → Decrypt values, apply with HLC comparison               │
│   → Emit 'haextension:sync:tables-updated' event            │
└─────────────────────────────────────────────────────────────┘`
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
        <span>{{ t('docs.sync.title') }}</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ t('docs.sync.title') }}</h1>
      <p class="text-lg text-muted-foreground">
        {{ t('docs.sync.subtitle') }}
      </p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.sync.sections.overview.title')" :icon="RefreshCw">
      <p class="text-muted-foreground leading-relaxed mb-6">
        {{ t('docs.sync.sections.overview.intro') }}
      </p>

      <div class="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent class="pt-6 text-center">
            <Database class="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 class="font-medium">{{ t('docs.sync.sections.overview.features.offline.title') }}</h4>
            <p class="text-sm text-muted-foreground">{{ t('docs.sync.sections.overview.features.offline.description') }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6 text-center">
            <Zap class="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 class="font-medium">{{ t('docs.sync.sections.overview.features.realtime.title') }}</h4>
            <p class="text-sm text-muted-foreground">{{ t('docs.sync.sections.overview.features.realtime.description') }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6 text-center">
            <Shield class="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 class="font-medium">{{ t('docs.sync.sections.overview.features.e2e.title') }}</h4>
            <p class="text-sm text-muted-foreground">{{ t('docs.sync.sections.overview.features.e2e.description') }}</p>
          </CardContent>
        </Card>
      </div>
    </DocsSection>

    <!-- CRDT Basics -->
    <DocsSection id="crdt-basics" :title="t('docs.sync.sections.crdtBasics.title')" :icon="Database">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.sync.sections.crdtBasics.intro') }}
      </p>

      <DocsAlert type="info" :title="t('docs.sync.sections.crdtBasics.lww.title')">
        {{ t('docs.sync.sections.crdtBasics.lww.description') }}
      </DocsAlert>

      <h3 class="font-semibold mt-8 mb-4">{{ t('docs.sync.sections.crdtBasics.columns.title') }}</h3>
      <p class="text-muted-foreground mb-4">{{ t('docs.sync.sections.crdtBasics.columns.description') }}</p>

      <DocsCodeBlock :path="paths.crdtColumns" />
    </DocsSection>

    <!-- Hybrid Logical Clock -->
    <DocsSection id="hlc" :title="t('docs.sync.sections.hlc.title')" :icon="Clock">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.sync.sections.hlc.intro') }}
      </p>

      <DocsCodeBlock :path="paths.hlcFormat" class="mb-6" />

      <p class="text-muted-foreground mb-4">{{ t('docs.sync.sections.hlc.benefits') }}</p>

      <ul class="space-y-2 text-muted-foreground">
        <li class="flex items-start gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
          <span>{{ t('docs.sync.sections.hlc.benefit1') }}</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
          <span>{{ t('docs.sync.sections.hlc.benefit2') }}</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
          <span>{{ t('docs.sync.sections.hlc.benefit3') }}</span>
        </li>
      </ul>
    </DocsSection>

    <!-- Column-Level Sync -->
    <DocsSection id="column-level" :title="t('docs.sync.sections.columnLevel.title')" :icon="Database">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.sync.sections.columnLevel.intro') }}
      </p>

      <Card class="mb-6">
        <CardHeader>
          <CardTitle class="text-base">{{ t('docs.sync.sections.columnLevel.example.title') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <DocsCodeBlock :path="paths.conflictExample" />
        </CardContent>
      </Card>

      <DocsAlert type="warning" :title="t('docs.sync.sections.columnLevel.important.title')">
        {{ t('docs.sync.sections.columnLevel.important.description') }}
      </DocsAlert>

      <h3 class="font-semibold mt-8 mb-4">{{ t('docs.sync.sections.columnLevel.hlcJson.title') }}</h3>
      <DocsCodeBlock :path="paths.columnHlcJson" />
    </DocsSection>

    <!-- Sync Flow -->
    <DocsSection id="sync-flow" :title="t('docs.sync.sections.syncFlow.title')" :icon="RefreshCw">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.sync.sections.syncFlow.intro') }}
      </p>

      <Card class="mb-8">
        <CardContent class="pt-6">
          <pre class="text-xs md:text-sm leading-relaxed overflow-x-auto"><code>{{ syncFlowDiagram }}</code></pre>
        </CardContent>
      </Card>

      <!-- Push -->
      <h3 id="push" class="font-semibold mb-4 scroll-mt-20">{{ t('docs.sync.sections.syncFlow.push.title') }}</h3>
      <p class="text-muted-foreground mb-4">{{ t('docs.sync.sections.syncFlow.push.description') }}</p>

      <DocsCodeBlock :path="paths.pushStructure" class="mb-8" />

      <!-- Pull -->
      <h3 id="pull" class="font-semibold mb-4 scroll-mt-20">{{ t('docs.sync.sections.syncFlow.pull.title') }}</h3>
      <p class="text-muted-foreground mb-4">{{ t('docs.sync.sections.syncFlow.pull.description') }}</p>

      <DocsCodeBlock :path="paths.pullLogic" />
    </DocsSection>

    <!-- Realtime -->
    <DocsSection id="realtime" :title="t('docs.sync.sections.realtime.title')" :icon="Zap">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.sync.sections.realtime.intro') }}
      </p>

      <DocsCodeBlock :path="paths.realtimeSubscription" class="mb-6" />

      <DocsAlert type="info" :title="t('docs.sync.sections.realtime.fallback.title')">
        {{ t('docs.sync.sections.realtime.fallback.description') }}
      </DocsAlert>
    </DocsSection>

    <!-- Soft Delete -->
    <DocsSection id="soft-delete" :title="t('docs.sync.sections.softDelete.title')" :icon="Database">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.sync.sections.softDelete.intro') }}
      </p>

      <DocsCodeBlock :path="paths.softDelete" class="mb-6" />

      <p class="text-muted-foreground">{{ t('docs.sync.sections.softDelete.why') }}</p>
    </DocsSection>

    <!-- Events -->
    <DocsSection id="events" :title="t('docs.sync.sections.events.title')" :icon="Zap">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.sync.sections.events.intro') }}
      </p>

      <DocsAlert type="info" :title="t('docs.sync.sections.events.automatic.title')" class="mb-6">
        {{ t('docs.sync.sections.events.automatic.description') }}
      </DocsAlert>

      <Card class="mb-6">
        <CardHeader>
          <CardTitle class="text-base">{{ t('docs.sync.sections.events.twoEvents.title') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4 text-sm">
            <div class="flex gap-4">
              <code class="font-mono text-primary shrink-0">sync:tables-updated</code>
              <span class="text-muted-foreground">{{ t('docs.sync.sections.events.twoEvents.internal') }}</span>
            </div>
            <div class="flex gap-4">
              <code class="font-mono text-primary shrink-0">haextension:sync:tables-updated</code>
              <span class="text-muted-foreground">{{ t('docs.sync.sections.events.twoEvents.extensions') }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 class="font-semibold mt-8 mb-4">{{ t('docs.sync.sections.events.usage.title') }}</h3>
      <p class="text-muted-foreground mb-4">{{ t('docs.sync.sections.events.usage.intro') }}</p>
      <DocsCodeBlock :path="paths.syncEventListener" />
    </DocsSection>

    <!-- Next Links -->
    <div class="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t mt-12">
      <NuxtLinkLocale to="/docs/architecture" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.architecture.title') }}</span>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/docs/architecture/extensions" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.architecture.nav.extensions') }}</span>
        <span>&rarr;</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
