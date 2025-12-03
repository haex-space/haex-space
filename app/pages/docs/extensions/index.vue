<script setup lang="ts">
import { Terminal, Code, Package, Key, Database, Shield, Rocket, FileCode, Settings, Layers, ExternalLink, ChevronRight, Check } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

useSeoMeta({
  title: 'Build Extensions - Developer Documentation - haex.space',
  description: 'Learn how to build your own extensions for haex-vault using the official SDK. Step-by-step guide with examples.',
})

// Table of contents for right sidebar
const tableOfContents = useState<Array<{ id: string; title: string; level?: number }>>('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.toc.overview'), level: 2 },
  { id: 'prerequisites', title: t('docs.toc.prerequisites'), level: 2 },
  { id: 'quickstart', title: t('docs.toc.quickstart'), level: 2 },
  { id: 'project-structure', title: t('docs.toc.projectStructure'), level: 2 },
  { id: 'manifest', title: t('docs.toc.manifest'), level: 2 },
  { id: 'sdk-setup', title: t('docs.toc.sdkSetup'), level: 2 },
  { id: 'database', title: t('docs.toc.database'), level: 2 },
  { id: 'storage', title: t('docs.toc.storage'), level: 2 },
  { id: 'filesystem', title: t('docs.toc.filesystem'), level: 2 },
  { id: 'web-requests', title: t('docs.toc.webRequests'), level: 2 },
  { id: 'permissions', title: t('docs.toc.permissions'), level: 2 },
  { id: 'context', title: t('docs.toc.context'), level: 2 },
  { id: 'build-sign', title: t('docs.toc.buildSign'), level: 2 },
  { id: 'publish', title: t('docs.toc.publish'), level: 2 },
]

// Feature definitions for overview section
const overviewFeatures = computed(() => [
  {
    icon: Database,
    title: t('docs.sections.overview.features.database.title'),
    description: t('docs.sections.overview.features.database.description')
  },
  {
    icon: Shield,
    title: t('docs.sections.overview.features.security.title'),
    description: t('docs.sections.overview.features.security.description')
  },
  {
    icon: Layers,
    title: t('docs.sections.overview.features.frameworks.title'),
    description: t('docs.sections.overview.features.frameworks.description')
  },
  {
    icon: Package,
    title: t('docs.sections.overview.features.distribution.title'),
    description: t('docs.sections.overview.features.distribution.description')
  }
])

// Content paths for code examples
const paths = {
  installNpm: '/extensions/install-npm',
  installPnpm: '/extensions/install-pnpm',
  installYarn: '/extensions/install-yarn',
  installBun: '/extensions/install-bun',
  runDev: '/extensions/run-dev',
  manifestBasic: '/extensions/manifest-basic',
  manifestPermissions: '/extensions/manifest-permissions',
  vueSetup: '/extensions/vue-setup',
  reactSetup: '/extensions/react-setup',
  vanillaSetup: '/extensions/vanilla-setup',
  migrations: '/extensions/migrations',
  databaseQueries: '/extensions/database-queries',
  drizzleSetup: '/extensions/drizzle-setup',
  storageApi: '/extensions/storage-api',
  filesystemApi: '/extensions/filesystem-api',
  webApi: '/extensions/web-api',
  permissionsCheck: '/extensions/permissions-check',
  contextApi: '/extensions/context-api',
  buildSign: '/extensions/build-sign',
  completeExample: '/extensions/complete-example'
}
</script>

<template>
  <div>
    <!-- Page Header -->
      <div class="mb-12">
        <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <NuxtLinkLocale to="/docs" class="hover:text-foreground">{{ t('docs.nav.gettingStarted') }}</NuxtLinkLocale>
          <ChevronRight class="w-4 h-4" />
          <span>{{ t('docs.nav.buildExtension') }}</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ t('docs.extensions.title') }}</h1>
        <p class="text-lg text-muted-foreground">
          {{ t('docs.extensions.subtitle') }}
        </p>
      </div>

      <!-- Overview -->
      <DocsSection id="overview" :title="t('docs.sections.overview.title')" :icon="Rocket">
        <p class="text-muted-foreground leading-relaxed mb-6">
          {{ t('docs.sections.overview.intro') }}
        </p>
        <DocsFeatureGrid :features="overviewFeatures" />
      </DocsSection>

      <!-- Prerequisites -->
      <DocsSection id="prerequisites" :title="t('docs.sections.prerequisites.title')" :icon="Settings">
        <Card>
          <CardContent class="pt-6">
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check class="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span class="font-medium">Node.js 18+</span>
                  <span class="text-muted-foreground"> - {{ t('docs.sections.prerequisites.nodejs') }}</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check class="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span class="font-medium">npm, pnpm {{ t('docs.sections.prerequisites.or') }} yarn</span>
                  <span class="text-muted-foreground"> - {{ t('docs.sections.prerequisites.packageManager') }}</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check class="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span class="font-medium">haex-vault</span>
                  <span class="text-muted-foreground"> - {{ t('docs.sections.prerequisites.vault') }}</span>
                  <NuxtLinkLocale to="/download" class="text-primary hover:underline ml-1">
                    {{ t('docs.sections.prerequisites.download') }}
                  </NuxtLinkLocale>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check class="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span class="font-medium">{{ t('docs.sections.prerequisites.webKnowledge') }}</span>
                  <span class="text-muted-foreground"> - HTML, CSS, JavaScript/TypeScript</span>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </DocsSection>

      <!-- Quickstart -->
      <DocsSection id="quickstart" :title="t('docs.sections.quickstart.title')" :icon="Terminal">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.quickstart.intro') }}
        </p>

        <div class="space-y-6">
          <DocsStep :number="1" :title="t('docs.sections.quickstart.step1.title')">
            <Tabs default-value="npm" class="mb-3">
              <TabsList class="grid w-full grid-cols-4">
                <TabsTrigger value="npm" class="flex items-center gap-2">
                  <Icon name="simple-icons:npm" class="w-4 h-4" />
                  npm
                </TabsTrigger>
                <TabsTrigger value="pnpm" class="flex items-center gap-2">
                  <Icon name="simple-icons:pnpm" class="w-4 h-4" />
                  pnpm
                </TabsTrigger>
                <TabsTrigger value="yarn" class="flex items-center gap-2">
                  <Icon name="simple-icons:yarn" class="w-4 h-4" />
                  yarn
                </TabsTrigger>
                <TabsTrigger value="bun" class="flex items-center gap-2">
                  <Icon name="simple-icons:bun" class="w-4 h-4" />
                  bun
                </TabsTrigger>
              </TabsList>
              <TabsContent value="npm" class="mt-4">
                <DocsCodeBlock :path="paths.installNpm" />
              </TabsContent>
              <TabsContent value="pnpm" class="mt-4">
                <DocsCodeBlock :path="paths.installPnpm" />
              </TabsContent>
              <TabsContent value="yarn" class="mt-4">
                <DocsCodeBlock :path="paths.installYarn" />
              </TabsContent>
              <TabsContent value="bun" class="mt-4">
                <DocsCodeBlock :path="paths.installBun" />
              </TabsContent>
            </Tabs>
            <p class="text-sm text-muted-foreground">
              {{ t('docs.sections.quickstart.step1.description') }}
            </p>
          </DocsStep>

          <DocsStep :number="2" :title="t('docs.sections.quickstart.step2.title')">
            <p class="text-muted-foreground mb-3">
              {{ t('docs.sections.quickstart.step2.description') }}
            </p>
            <DocsAlert type="warning" :title="t('docs.sections.quickstart.step2.warning.title')">
              {{ t('docs.sections.quickstart.step2.warning.description') }}
            </DocsAlert>
          </DocsStep>

          <DocsStep :number="3" :title="t('docs.sections.quickstart.step3.title')">
            <DocsCodeBlock :path="paths.runDev" />
            <p class="text-sm text-muted-foreground mt-3">
              {{ t('docs.sections.quickstart.step3.description') }}
            </p>
          </DocsStep>
        </div>
      </DocsSection>

      <!-- Project Structure -->
      <DocsSection id="project-structure" :title="t('docs.sections.projectStructure.title')" :icon="FileCode">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.projectStructure.intro') }}
        </p>
        <Card>
          <CardContent class="pt-6">
            <pre class="text-sm leading-relaxed"><code>my-extension/
├── haextension/
│   ├── manifest.json      # {{ t('docs.sections.projectStructure.files.manifest') }}
│   ├── public.key         # {{ t('docs.sections.projectStructure.files.publicKey') }}
│   ├── private.key        # {{ t('docs.sections.projectStructure.files.privateKey') }}
│   └── icon.png           # {{ t('docs.sections.projectStructure.files.icon') }}
├── src/
│   ├── main.ts            # {{ t('docs.sections.projectStructure.files.main') }}
│   ├── App.vue            # {{ t('docs.sections.projectStructure.files.app') }}
│   └── ...
├── haextension.config.json # {{ t('docs.sections.projectStructure.files.config') }}
├── package.json
└── vite.config.ts</code></pre>
          </CardContent>
        </Card>
      </DocsSection>

      <!-- Manifest -->
      <DocsSection id="manifest" :title="t('docs.sections.manifest.title')" :icon="Code">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.manifest.intro') }}
        </p>

        <h3 class="font-semibold mb-3">{{ t('docs.sections.manifest.basic') }}</h3>
        <DocsCodeBlock :path="paths.manifestBasic" class="mb-6" />

        <h3 class="font-semibold mb-3">{{ t('docs.sections.manifest.fields.title') }}</h3>
        <Card>
          <CardContent class="pt-6">
            <div class="space-y-4 text-sm">
              <div class="flex gap-4">
                <code class="font-mono text-primary shrink-0 w-32">name</code>
                <span class="text-muted-foreground">{{ t('docs.sections.manifest.fields.name') }}</span>
              </div>
              <div class="flex gap-4">
                <code class="font-mono text-primary shrink-0 w-32">version</code>
                <span class="text-muted-foreground">{{ t('docs.sections.manifest.fields.version') }}</span>
              </div>
              <div class="flex gap-4">
                <code class="font-mono text-primary shrink-0 w-32">publicKey</code>
                <span class="text-muted-foreground">{{ t('docs.sections.manifest.fields.publicKey') }}</span>
              </div>
              <div class="flex gap-4">
                <code class="font-mono text-primary shrink-0 w-32">signature</code>
                <span class="text-muted-foreground">{{ t('docs.sections.manifest.fields.signature') }}</span>
              </div>
              <div class="flex gap-4">
                <code class="font-mono text-primary shrink-0 w-32">entry</code>
                <span class="text-muted-foreground">{{ t('docs.sections.manifest.fields.entry') }}</span>
              </div>
              <div class="flex gap-4">
                <code class="font-mono text-primary shrink-0 w-32">displayMode</code>
                <span class="text-muted-foreground">{{ t('docs.sections.manifest.fields.displayMode') }}</span>
              </div>
              <div class="flex gap-4">
                <code class="font-mono text-primary shrink-0 w-32">singleInstance</code>
                <span class="text-muted-foreground">{{ t('docs.sections.manifest.fields.singleInstance') }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DocsSection>

      <!-- SDK Setup -->
      <DocsSection id="sdk-setup" :title="t('docs.sections.sdkSetup.title')" :icon="Package">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.sdkSetup.intro') }}
        </p>

        <Tabs default-value="vue" class="mb-6">
          <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="vue" class="flex items-center gap-2">
              <Icon name="simple-icons:vuedotjs" class="w-4 h-4" />
              Vue 3
            </TabsTrigger>
            <TabsTrigger value="react" class="flex items-center gap-2">
              <Icon name="simple-icons:react" class="w-4 h-4" />
              React
            </TabsTrigger>
            <TabsTrigger value="vanilla" class="flex items-center gap-2">
              <Icon name="simple-icons:javascript" class="w-4 h-4" />
              Vanilla JS
            </TabsTrigger>
          </TabsList>
          <TabsContent value="vue" class="mt-4">
            <DocsCodeBlock :path="paths.vueSetup" />
          </TabsContent>
          <TabsContent value="react" class="mt-4">
            <DocsCodeBlock :path="paths.reactSetup" />
          </TabsContent>
          <TabsContent value="vanilla" class="mt-4">
            <DocsCodeBlock :path="paths.vanillaSetup" />
          </TabsContent>
        </Tabs>

        <DocsAlert type="info" :title="t('docs.sections.sdkSetup.tip.title')">
          {{ t('docs.sections.sdkSetup.tip.description') }}
        </DocsAlert>
      </DocsSection>

      <!-- Database -->
      <DocsSection id="database" :title="t('docs.sections.database.title')" :icon="Database">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.database.intro') }}
        </p>

        <h3 class="font-semibold mb-3">{{ t('docs.sections.database.migrations.title') }}</h3>
        <p class="text-muted-foreground mb-4">
          {{ t('docs.sections.database.migrations.description') }}
        </p>
        <DocsCodeBlock :path="paths.migrations" class="mb-8" />

        <DocsAlert type="warning" :title="t('docs.sections.database.crdt.title')" class="mb-8">
          {{ t('docs.sections.database.crdt.description') }}
        </DocsAlert>

        <h3 class="font-semibold mb-3">{{ t('docs.sections.database.queries.title') }}</h3>
        <DocsCodeBlock :path="paths.databaseQueries" class="mb-8" />

        <h3 class="font-semibold mb-3">{{ t('docs.sections.database.drizzle.title') }}</h3>
        <p class="text-muted-foreground mb-4">
          {{ t('docs.sections.database.drizzle.description') }}
        </p>
        <DocsCodeBlock :path="paths.drizzleSetup" />
      </DocsSection>

      <!-- Storage -->
      <DocsSection id="storage" :title="t('docs.sections.storage.title')" :icon="Package">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.storage.intro') }}
        </p>
        <DocsCodeBlock :path="paths.storageApi" />
      </DocsSection>

      <!-- Filesystem -->
      <DocsSection id="filesystem" :title="t('docs.sections.filesystem.title')" :icon="FileCode">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.filesystem.intro') }}
        </p>
        <DocsCodeBlock :path="paths.filesystemApi" />
      </DocsSection>

      <!-- Web Requests -->
      <DocsSection id="web-requests" :title="t('docs.sections.webRequests.title')" :icon="ExternalLink">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.webRequests.intro') }}
        </p>
        <DocsCodeBlock :path="paths.webApi" />
      </DocsSection>

      <!-- Permissions -->
      <DocsSection id="permissions" :title="t('docs.sections.permissions.title')" :icon="Shield">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.permissions.intro') }}
        </p>

        <h3 class="font-semibold mb-3">{{ t('docs.sections.permissions.manifest.title') }}</h3>
        <DocsCodeBlock :path="paths.manifestPermissions" class="mb-8" />

        <h3 class="font-semibold mb-3">{{ t('docs.sections.permissions.operations.title') }}</h3>
        <Card class="mb-8">
          <CardContent class="pt-6">
            <div class="space-y-4 text-sm">
              <div>
                <h4 class="font-medium mb-2">{{ t('docs.sections.permissions.operations.database') }}</h4>
                <ul class="space-y-1 text-muted-foreground ml-4">
                  <li><code class="text-primary">read</code> - SELECT only</li>
                  <li><code class="text-primary">readWrite</code> - SELECT + INSERT/UPDATE</li>
                  <li><code class="text-primary">create</code> - CREATE TABLE</li>
                  <li><code class="text-primary">delete</code> - DELETE rows</li>
                  <li><code class="text-primary">alterDrop</code> - ALTER/DROP operations</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">{{ t('docs.sections.permissions.operations.filesystem') }}</h4>
                <ul class="space-y-1 text-muted-foreground ml-4">
                  <li><code class="text-primary">read</code> - {{ t('docs.sections.permissions.operations.fsRead') }}</li>
                  <li><code class="text-primary">readWrite</code> - {{ t('docs.sections.permissions.operations.fsReadWrite') }}</li>
                  <li><code class="text-primary">delete</code> - {{ t('docs.sections.permissions.operations.fsDelete') }}</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">{{ t('docs.sections.permissions.operations.http') }}</h4>
                <p class="text-muted-foreground ml-4">{{ t('docs.sections.permissions.operations.httpDescription') }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 class="font-semibold mb-3">{{ t('docs.sections.permissions.checking.title') }}</h3>
        <DocsCodeBlock :path="paths.permissionsCheck" />
      </DocsSection>

      <!-- Context -->
      <DocsSection id="context" :title="t('docs.sections.context.title')" :icon="Settings">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.context.intro') }}
        </p>
        <DocsCodeBlock :path="paths.contextApi" />
      </DocsSection>

      <!-- Build & Sign -->
      <DocsSection id="build-sign" :title="t('docs.sections.buildSign.title')" :icon="Key">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.buildSign.intro') }}
        </p>
        <DocsCodeBlock :path="paths.buildSign" class="mb-6" />
        <DocsAlert type="danger" :title="t('docs.sections.buildSign.warning.title')">
          {{ t('docs.sections.buildSign.warning.description') }}
        </DocsAlert>
      </DocsSection>

      <!-- Publish -->
      <DocsSection id="publish" :title="t('docs.sections.publish.title')" :icon="Rocket">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.publish.intro') }}
        </p>

        <Card>
          <CardContent class="pt-6">
            <ol class="space-y-4">
              <li class="flex gap-4">
                <span class="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center shrink-0">1</span>
                <div>
                  <span class="font-medium">{{ t('docs.sections.publish.steps.step1.title') }}</span>
                  <p class="text-sm text-muted-foreground">{{ t('docs.sections.publish.steps.step1.description') }}</p>
                </div>
              </li>
              <li class="flex gap-4">
                <span class="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center shrink-0">2</span>
                <div>
                  <span class="font-medium">{{ t('docs.sections.publish.steps.step2.title') }}</span>
                  <p class="text-sm text-muted-foreground">{{ t('docs.sections.publish.steps.step2.description') }}</p>
                </div>
              </li>
              <li class="flex gap-4">
                <span class="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center shrink-0">3</span>
                <div>
                  <span class="font-medium">{{ t('docs.sections.publish.steps.step3.title') }}</span>
                  <p class="text-sm text-muted-foreground">{{ t('docs.sections.publish.steps.step3.description') }}</p>
                </div>
              </li>
              <li class="flex gap-4">
                <span class="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center shrink-0">4</span>
                <div>
                  <span class="font-medium">{{ t('docs.sections.publish.steps.step4.title') }}</span>
                  <p class="text-sm text-muted-foreground">{{ t('docs.sections.publish.steps.step4.description') }}</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </DocsSection>

      <!-- Complete Example -->
      <DocsSection id="complete-example" :title="t('docs.sections.completeExample.title')" :icon="Code">
        <p class="text-muted-foreground mb-6">
          {{ t('docs.sections.completeExample.intro') }}
        </p>
        <DocsCodeBlock :path="paths.completeExample" class="max-h-[600px] overflow-y-auto" />
      </DocsSection>

      <!-- Next Steps -->
      <section class="bg-muted/50 rounded-xl p-8">
        <h2 class="text-xl font-bold mb-4">{{ t('docs.nextSteps.title') }}</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <a
            href="https://github.com/haex-space/vault-sdk"
            target="_blank"
            class="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
          >
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code class="w-5 h-5 text-primary" />
            </div>
            <div>
              <span class="font-medium">{{ t('docs.nextSteps.sdk.title') }}</span>
              <p class="text-sm text-muted-foreground">{{ t('docs.nextSteps.sdk.description') }}</p>
            </div>
            <ExternalLink class="w-4 h-4 text-muted-foreground ml-auto" />
          </a>
          <NuxtLinkLocale
            to="/marketplace"
            class="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
          >
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package class="w-5 h-5 text-primary" />
            </div>
            <div>
              <span class="font-medium">{{ t('docs.nextSteps.marketplace.title') }}</span>
              <p class="text-sm text-muted-foreground">{{ t('docs.nextSteps.marketplace.description') }}</p>
            </div>
            <ChevronRight class="w-4 h-4 text-muted-foreground ml-auto" />
          </NuxtLinkLocale>
        </div>
      </section>
  </div>
</template>
