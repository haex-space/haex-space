<script setup lang="ts">
import { Code, Database, HardDrive, FolderOpen, Globe, Settings, Palette, Languages } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.sdk.toc.overview'), level: 2 },
  { id: 'installation', title: t('docs.sdk.toc.installation'), level: 2 },
  { id: 'framework-setup', title: t('docs.sdk.toc.frameworkSetup'), level: 2 },
  { id: 'client-api', title: t('docs.sdk.toc.clientApi'), level: 2 },
  { id: 'context', title: t('docs.sdk.toc.context'), level: 2 },
  { id: 'events', title: t('docs.sdk.toc.events'), level: 2 },
]

const code = {
  install: 'npm install @haex-space/vault-sdk'
}

const apiModules = computed(() => [
  {
    icon: Database,
    title: t('docs.sdk.modules.database.title'),
    description: t('docs.sdk.modules.database.description'),
    href: '/docs/sdk/database'
  },
  {
    icon: HardDrive,
    title: t('docs.sdk.modules.storage.title'),
    description: t('docs.sdk.modules.storage.description'),
    href: '/docs/sdk/storage'
  },
  {
    icon: FolderOpen,
    title: t('docs.sdk.modules.filesystem.title'),
    description: t('docs.sdk.modules.filesystem.description'),
    href: '/docs/sdk/filesystem'
  },
  {
    icon: Globe,
    title: t('docs.sdk.modules.web.title'),
    description: t('docs.sdk.modules.web.description'),
    href: '/docs/sdk/web'
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
        <span>{{ t('docs.nav.sdkReference') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.sdk.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.sdk.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.sdk.sections.overview.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdk.sections.overview.intro') }}</p>

      <div class="grid md:grid-cols-2 gap-4">
        <NuxtLink
          v-for="module in apiModules"
          :key="module.href"
          :to="module.href"
          class="group"
        >
          <Card class="h-full transition-colors hover:border-primary/50">
            <CardHeader class="pb-2">
              <CardTitle class="text-base flex items-center gap-2">
                <component :is="module.icon" class="w-4 h-4 text-primary" />
                {{ module.title }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground">{{ module.description }}</p>
            </CardContent>
          </Card>
        </NuxtLink>
      </div>
    </DocsSection>

    <!-- Installation -->
    <DocsSection id="installation" :title="t('docs.sdk.sections.installation.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdk.sections.installation.intro') }}</p>
      <DocsCodeBlock :code="code.install" language="bash" />
    </DocsSection>

    <!-- Framework Setup -->
    <DocsSection id="framework-setup" :title="t('docs.sdk.sections.frameworkSetup.title')" :icon="Settings">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdk.sections.frameworkSetup.intro') }}</p>

      <Tabs default-value="vue" class="w-full">
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="vue">Vue</TabsTrigger>
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="svelte">Svelte</TabsTrigger>
          <TabsTrigger value="vanilla">Vanilla</TabsTrigger>
        </TabsList>

        <TabsContent value="vue" class="space-y-4">
          <h4 class="font-medium">{{ t('docs.sdk.sections.frameworkSetup.setup') }}</h4>
          <DocsCodeBlock path="/sdk/vue-setup" />
          <h4 class="font-medium">{{ t('docs.sdk.sections.frameworkSetup.usage') }}</h4>
          <DocsCodeBlock path="/sdk/vue-usage" />
        </TabsContent>

        <TabsContent value="react" class="space-y-4">
          <h4 class="font-medium">{{ t('docs.sdk.sections.frameworkSetup.setup') }}</h4>
          <DocsCodeBlock path="/sdk/react-setup" />
          <h4 class="font-medium">{{ t('docs.sdk.sections.frameworkSetup.usage') }}</h4>
          <DocsCodeBlock path="/sdk/react-usage" />
        </TabsContent>

        <TabsContent value="svelte" class="space-y-4">
          <h4 class="font-medium">{{ t('docs.sdk.sections.frameworkSetup.setup') }}</h4>
          <DocsCodeBlock path="/sdk/svelte-setup" />
          <h4 class="font-medium">{{ t('docs.sdk.sections.frameworkSetup.usage') }}</h4>
          <DocsCodeBlock path="/sdk/svelte-usage" />
        </TabsContent>

        <TabsContent value="vanilla" class="space-y-4">
          <h4 class="font-medium">{{ t('docs.sdk.sections.frameworkSetup.setup') }}</h4>
          <DocsCodeBlock path="/sdk/vanilla-setup" />
        </TabsContent>
      </Tabs>
    </DocsSection>

    <!-- Client API -->
    <DocsSection id="client-api" :title="t('docs.sdk.sections.clientApi.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdk.sections.clientApi.intro') }}</p>
      <DocsCodeBlock path="/sdk/client-api" />
    </DocsSection>

    <!-- Context -->
    <DocsSection id="context" :title="t('docs.sdk.sections.context.title')" :icon="Palette">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdk.sections.context.intro') }}</p>
      <DocsCodeBlock path="/sdk/context" />

      <div class="mt-6 grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center gap-2 mb-2">
              <Palette class="w-4 h-4 text-primary" />
              <span class="font-medium">theme</span>
            </div>
            <p class="text-sm text-muted-foreground">{{ t('docs.sdk.sections.context.themeDesc') }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center gap-2 mb-2">
              <Languages class="w-4 h-4 text-primary" />
              <span class="font-medium">locale</span>
            </div>
            <p class="text-sm text-muted-foreground">{{ t('docs.sdk.sections.context.localeDesc') }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center gap-2 mb-2">
              <Settings class="w-4 h-4 text-primary" />
              <span class="font-medium">platform</span>
            </div>
            <p class="text-sm text-muted-foreground">{{ t('docs.sdk.sections.context.platformDesc') }}</p>
          </CardContent>
        </Card>
      </div>
    </DocsSection>

    <!-- Events -->
    <DocsSection id="events" :title="t('docs.sdk.sections.events.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdk.sections.events.intro') }}</p>
      <DocsCodeBlock path="/sdk/events" />
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLink to="/docs/extensions/publishing" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.publishing') }}</span>
      </NuxtLink>
      <NuxtLink to="/docs/sdk/database" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.sdkDatabase') }}</span>
        <span>&rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>
