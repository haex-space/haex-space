<script setup lang="ts">
import { Layers, Server, Database, Shield, RefreshCw, Puzzle, Smartphone, Monitor, ChevronRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

useSeoMeta({
  title: 'Architecture Overview - Developer Documentation - haex.space',
  description: 'Comprehensive architecture documentation for haex-vault. Learn about the system design, components, and how they work together.',
})

const tableOfContents = useState<Array<{ id: string; title: string; level?: number }>>('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.architecture.toc.overview'), level: 2 },
  { id: 'tech-stack', title: t('docs.architecture.toc.techStack'), level: 2 },
  { id: 'repositories', title: t('docs.architecture.toc.repositories'), level: 2 },
  { id: 'project-structure', title: t('docs.architecture.toc.projectStructure'), level: 2 },
  { id: 'data-flow', title: t('docs.architecture.toc.dataFlow'), level: 2 },
  { id: 'security', title: t('docs.architecture.toc.security'), level: 2 },
]

const techStack = computed(() => [
  {
    icon: Monitor,
    title: t('docs.architecture.techStack.frontend.title'),
    items: ['Vue 3 + TypeScript', 'Nuxt UI Components', 'Pinia State Management', 'Drizzle ORM']
  },
  {
    icon: Server,
    title: t('docs.architecture.techStack.backend.title'),
    items: ['Tauri (Rust)', 'SQLite + SQLCipher', 'CRDT Sync Engine', 'Extension Runtime']
  },
  {
    icon: RefreshCw,
    title: t('docs.architecture.techStack.sync.title'),
    items: ['Supabase (PostgreSQL)', 'Realtime Subscriptions', 'Column-Level HLC', 'E2E Encryption']
  },
  {
    icon: Puzzle,
    title: t('docs.architecture.techStack.extensions.title'),
    items: ['iframe/WebView Sandbox', 'haex-vault-sdk', 'Permission System', 'Hot Reload (Dev)']
  }
])

const repositories = [
  { name: 'haex-vault', description: t('docs.architecture.repos.vault'), stack: 'Tauri + Vue' },
  { name: 'haex-sync-server', description: t('docs.architecture.repos.syncServer'), stack: 'Hono + Supabase' },
  { name: 'haex-marketplace', description: t('docs.architecture.repos.marketplace'), stack: 'Hono + Supabase' },
  { name: 'haex-vault-sdk', description: t('docs.architecture.repos.sdk'), stack: 'TypeScript' },
  { name: 'haex-space', description: t('docs.architecture.repos.website'), stack: 'Nuxt' },
]
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <NuxtLinkLocale to="/docs" class="hover:text-foreground">{{ t('docs.nav.gettingStarted') }}</NuxtLinkLocale>
        <ChevronRight class="w-4 h-4" />
        <span>{{ t('docs.architecture.title') }}</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ t('docs.architecture.title') }}</h1>
      <p class="text-lg text-muted-foreground">
        {{ t('docs.architecture.subtitle') }}
      </p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.architecture.sections.overview.title')" :icon="Layers">
      <p class="text-muted-foreground leading-relaxed mb-6">
        {{ t('docs.architecture.sections.overview.intro') }}
      </p>

      <!-- Architecture Diagram -->
      <Card class="mb-6 overflow-hidden">
        <CardContent class="pt-6">
          <pre class="text-xs md:text-sm leading-relaxed overflow-x-auto"><code>┌─────────────────────────────────────────────────────────────────┐
│                         haex-vault                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Vue 3 Frontend                            │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │   Stores    │  │ Composables │  │     Components      │  │ │
│  │  │  (Pinia)    │  │  (Handlers) │  │    (Nuxt UI)        │  │ │
│  │  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │ │
│  └─────────┼────────────────┼────────────────────┼─────────────┘ │
│            │                │                    │               │
│            └────────────────┼────────────────────┘               │
│                             │ Tauri IPC                          │
│  ┌──────────────────────────┴──────────────────────────────────┐ │
│  │                    Tauri Backend (Rust)                      │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │    CRDT     │  │  Extension  │  │     Database        │  │ │
│  │  │   Engine    │  │   Runtime   │  │  (SQLite/SQLCipher) │  │ │
│  │  └──────┬──────┘  └─────────────┘  └──────────┬──────────┘  │ │
│  └─────────┼─────────────────────────────────────┼─────────────┘ │
└────────────┼─────────────────────────────────────┼───────────────┘
             │                                     │
             │ HTTPS/WSS                           │ Encrypted
             ▼                                     ▼
┌─────────────────────────┐              ┌─────────────────────────┐
│    haex-sync-server     │              │    Local SQLite DB      │
│  (Supabase/PostgreSQL)  │              │   (Encrypted Vault)     │
└─────────────────────────┘              └─────────────────────────┘</code></pre>
        </CardContent>
      </Card>

      <p class="text-muted-foreground leading-relaxed">
        {{ t('docs.architecture.sections.overview.description') }}
      </p>
    </DocsSection>

    <!-- Tech Stack -->
    <DocsSection id="tech-stack" :title="t('docs.architecture.sections.techStack.title')" :icon="Server">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.architecture.sections.techStack.intro') }}
      </p>

      <div class="grid md:grid-cols-2 gap-4">
        <Card v-for="tech in techStack" :key="tech.title">
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <component :is="tech.icon" class="w-4 h-4 text-primary" />
              {{ tech.title }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-sm text-muted-foreground space-y-1">
              <li v-for="item in tech.items" :key="item" class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary/50" />
                {{ item }}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DocsSection>

    <!-- Repositories -->
    <DocsSection id="repositories" :title="t('docs.architecture.sections.repositories.title')" :icon="Database">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.architecture.sections.repositories.intro') }}
      </p>

      <Card>
        <CardContent class="pt-6">
          <div class="space-y-4">
            <div v-for="repo in repositories" :key="repo.name" class="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
              <div class="flex-1">
                <a
                  :href="`https://github.com/haex-space/${repo.name}`"
                  target="_blank"
                  class="font-mono text-primary hover:underline"
                >
                  {{ repo.name }}
                </a>
                <p class="text-sm text-muted-foreground mt-1">{{ repo.description }}</p>
              </div>
              <Badge variant="secondary" class="shrink-0">{{ repo.stack }}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </DocsSection>

    <!-- Project Structure -->
    <DocsSection id="project-structure" :title="t('docs.architecture.sections.projectStructure.title')" :icon="Layers">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.architecture.sections.projectStructure.intro') }}
      </p>

      <Card>
        <CardContent class="pt-6">
          <pre class="text-sm leading-relaxed overflow-x-auto"><code>haex-vault/
├── src/                      # Vue Frontend
│   ├── components/           # Vue Components (Nuxt UI)
│   ├── stores/               # Pinia Stores
│   │   ├── vault/            # Vault Management
│   │   ├── sync/             # Sync Engine & Orchestrator
│   │   │   ├── orchestrator/ # Push/Pull/Realtime Logic
│   │   │   ├── engine.ts     # Key Management
│   │   │   ├── backends.ts   # Backend Configuration
│   │   │   └── syncEvents.ts # Event Bus for Updates
│   │   └── extensions/       # Extension Store
│   ├── composables/          # IPC Handlers & Utilities
│   │   └── handlers/         # Tauri Command Wrappers
│   ├── database/             # Drizzle Schemas
│   └── utils/crypto/         # Encryption Utilities
├── src-tauri/                # Rust Backend
│   ├── src/
│   │   ├── crdt/             # CRDT Implementation
│   │   │   ├── commands.rs   # Tauri Commands
│   │   │   ├── trigger.rs    # SQL Trigger Generation
│   │   │   └── hlc.rs        # Hybrid Logical Clock
│   │   ├── extension/        # Extension Runtime
│   │   │   ├── core/         # Manager, Manifest, Protocol
│   │   │   ├── database/     # SQL Execution & Validation
│   │   │   ├── permissions/  # Permission Enforcement
│   │   │   └── webview/      # Multi-Window Management
│   │   ├── database/         # SQLite Connection & Migrations
│   │   └── lib.rs            # Tauri Command Registration
│   └── migrations/           # SQL Migrations
└── .claude/                  # Knowledge Database</code></pre>
        </CardContent>
      </Card>
    </DocsSection>

    <!-- Data Flow -->
    <DocsSection id="data-flow" :title="t('docs.architecture.sections.dataFlow.title')" :icon="RefreshCw">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.architecture.sections.dataFlow.intro') }}
      </p>

      <Card class="mb-6">
        <CardContent class="pt-6">
          <pre class="text-xs md:text-sm leading-relaxed overflow-x-auto"><code>{{ t('docs.architecture.sections.dataFlow.diagram') }}</code></pre>
        </CardContent>
      </Card>

      <div class="space-y-4">
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span class="text-primary font-bold">1</span>
          </div>
          <div>
            <h4 class="font-medium">{{ t('docs.architecture.sections.dataFlow.steps.step1.title') }}</h4>
            <p class="text-sm text-muted-foreground">{{ t('docs.architecture.sections.dataFlow.steps.step1.description') }}</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span class="text-primary font-bold">2</span>
          </div>
          <div>
            <h4 class="font-medium">{{ t('docs.architecture.sections.dataFlow.steps.step2.title') }}</h4>
            <p class="text-sm text-muted-foreground">{{ t('docs.architecture.sections.dataFlow.steps.step2.description') }}</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span class="text-primary font-bold">3</span>
          </div>
          <div>
            <h4 class="font-medium">{{ t('docs.architecture.sections.dataFlow.steps.step3.title') }}</h4>
            <p class="text-sm text-muted-foreground">{{ t('docs.architecture.sections.dataFlow.steps.step3.description') }}</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span class="text-primary font-bold">4</span>
          </div>
          <div>
            <h4 class="font-medium">{{ t('docs.architecture.sections.dataFlow.steps.step4.title') }}</h4>
            <p class="text-sm text-muted-foreground">{{ t('docs.architecture.sections.dataFlow.steps.step4.description') }}</p>
          </div>
        </div>
      </div>
    </DocsSection>

    <!-- Security -->
    <DocsSection id="security" :title="t('docs.architecture.sections.security.title')" :icon="Shield">
      <p class="text-muted-foreground mb-6">
        {{ t('docs.architecture.sections.security.intro') }}
      </p>

      <div class="space-y-4">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">{{ t('docs.architecture.sections.security.encryption.title') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ t('docs.architecture.sections.security.encryption.description') }}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">{{ t('docs.architecture.sections.security.twoPassword.title') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">{{ t('docs.architecture.sections.security.twoPassword.description') }}</p>
            <ul class="text-sm text-muted-foreground space-y-2">
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2" />
                <span><strong>{{ t('docs.architecture.sections.security.twoPassword.vault') }}:</strong> {{ t('docs.architecture.sections.security.twoPassword.vaultDesc') }}</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2" />
                <span><strong>{{ t('docs.architecture.sections.security.twoPassword.server') }}:</strong> {{ t('docs.architecture.sections.security.twoPassword.serverDesc') }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">{{ t('docs.architecture.sections.security.e2e.title') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ t('docs.architecture.sections.security.e2e.description') }}</p>
          </CardContent>
        </Card>
      </div>
    </DocsSection>

    <!-- Next Links -->
    <div class="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t mt-12">
      <NuxtLinkLocale to="/docs" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.introduction') }}</span>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/docs/architecture/sync" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.architecture.nav.sync') }}</span>
        <span>&rarr;</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
