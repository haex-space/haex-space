<script setup lang="ts">
import { Plug, Code, Shield, Zap, AlertCircle } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.sdkExternalBridge.toc.overview'), level: 2 },
  { id: 'how-it-works', title: t('docs.sdkExternalBridge.toc.howItWorks'), level: 2 },
  { id: 'handling-requests', title: t('docs.sdkExternalBridge.toc.handlingRequests'), level: 2 },
  { id: 'connection-states', title: t('docs.sdkExternalBridge.toc.connectionStates'), level: 2 },
  { id: 'authorization', title: t('docs.sdkExternalBridge.toc.authorization'), level: 2 },
  { id: 'types', title: t('docs.sdkExternalBridge.toc.types'), level: 2 },
]
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <NuxtLinkLocale to="/docs" class="hover:text-foreground">{{ t('docs.title') }}</NuxtLinkLocale>
        <span>/</span>
        <NuxtLinkLocale to="/docs/sdk" class="hover:text-foreground">{{ t('docs.nav.sdkReference') }}</NuxtLinkLocale>
        <span>/</span>
        <span>{{ t('docs.nav.sdkExternalBridge') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.sdkExternalBridge.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.sdkExternalBridge.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.sdkExternalBridge.sections.overview.title')" :icon="Plug">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkExternalBridge.sections.overview.intro') }}</p>

      <div class="grid gap-4 md:grid-cols-3 mb-6">
        <div class="p-4 rounded-lg border bg-card">
          <div class="font-semibold mb-2">{{ t('docs.sdkExternalBridge.sections.overview.useCases.browser') }}</div>
          <p class="text-sm text-muted-foreground">{{ t('docs.sdkExternalBridge.sections.overview.useCases.browserDesc') }}</p>
        </div>
        <div class="p-4 rounded-lg border bg-card">
          <div class="font-semibold mb-2">{{ t('docs.sdkExternalBridge.sections.overview.useCases.cli') }}</div>
          <p class="text-sm text-muted-foreground">{{ t('docs.sdkExternalBridge.sections.overview.useCases.cliDesc') }}</p>
        </div>
        <div class="p-4 rounded-lg border bg-card">
          <div class="font-semibold mb-2">{{ t('docs.sdkExternalBridge.sections.overview.useCases.server') }}</div>
          <p class="text-sm text-muted-foreground">{{ t('docs.sdkExternalBridge.sections.overview.useCases.serverDesc') }}</p>
        </div>
      </div>

      <DocsAlert type="info">
        {{ t('docs.sdkExternalBridge.sections.overview.note') }}
      </DocsAlert>
    </DocsSection>

    <!-- How it Works -->
    <DocsSection id="how-it-works" :title="t('docs.sdkExternalBridge.sections.howItWorks.title')" :icon="Zap">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkExternalBridge.sections.howItWorks.intro') }}</p>

      <ol class="list-decimal list-inside space-y-3 mb-6 text-muted-foreground">
        <li>{{ t('docs.sdkExternalBridge.sections.howItWorks.steps.connect') }}</li>
        <li>{{ t('docs.sdkExternalBridge.sections.howItWorks.steps.handshake') }}</li>
        <li>{{ t('docs.sdkExternalBridge.sections.howItWorks.steps.approval') }}</li>
        <li>{{ t('docs.sdkExternalBridge.sections.howItWorks.steps.request') }}</li>
        <li>{{ t('docs.sdkExternalBridge.sections.howItWorks.steps.autostart') }}</li>
        <li>{{ t('docs.sdkExternalBridge.sections.howItWorks.steps.response') }}</li>
      </ol>

      <DocsCodeBlock path="/sdk/external-bridge-flow" />
    </DocsSection>

    <!-- Handling Requests -->
    <DocsSection id="handling-requests" :title="t('docs.sdkExternalBridge.sections.handlingRequests.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkExternalBridge.sections.handlingRequests.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.sdkExternalBridge.sections.handlingRequests.eventListener') }}</h3>
      <DocsCodeBlock path="/sdk/external-bridge-handler" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkExternalBridge.sections.handlingRequests.registerHandler') }}</h3>
      <DocsCodeBlock path="/sdk/external-bridge-register" />
    </DocsSection>

    <!-- Connection States -->
    <DocsSection id="connection-states" :title="t('docs.sdkExternalBridge.sections.connectionStates.title')" :icon="AlertCircle">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkExternalBridge.sections.connectionStates.intro') }}</p>
      <DocsCodeBlock path="/sdk/external-bridge-states" />
    </DocsSection>

    <!-- Authorization -->
    <DocsSection id="authorization" :title="t('docs.sdkExternalBridge.sections.authorization.title')" :icon="Shield">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkExternalBridge.sections.authorization.intro') }}</p>

      <div class="space-y-4 mb-6">
        <div class="p-4 rounded-lg border bg-card">
          <div class="font-semibold mb-2">{{ t('docs.sdkExternalBridge.sections.authorization.allowOnce') }}</div>
          <p class="text-sm text-muted-foreground">{{ t('docs.sdkExternalBridge.sections.authorization.allowOnceDesc') }}</p>
        </div>
        <div class="p-4 rounded-lg border bg-card">
          <div class="font-semibold mb-2">{{ t('docs.sdkExternalBridge.sections.authorization.allowAlways') }}</div>
          <p class="text-sm text-muted-foreground">{{ t('docs.sdkExternalBridge.sections.authorization.allowAlwaysDesc') }}</p>
        </div>
        <div class="p-4 rounded-lg border bg-card">
          <div class="font-semibold mb-2">{{ t('docs.sdkExternalBridge.sections.authorization.block') }}</div>
          <p class="text-sm text-muted-foreground">{{ t('docs.sdkExternalBridge.sections.authorization.blockDesc') }}</p>
        </div>
      </div>

      <DocsAlert type="warning">
        {{ t('docs.sdkExternalBridge.sections.authorization.warning') }}
      </DocsAlert>
    </DocsSection>

    <!-- Types -->
    <DocsSection id="types" :title="t('docs.sdkExternalBridge.sections.types.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkExternalBridge.sections.types.intro') }}</p>
      <DocsCodeBlock path="/sdk/external-bridge-types" />
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLinkLocale to="/docs/sdk/web" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.sdkWeb') }}</span>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/docs" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.introduction') }}</span>
        <span>&rarr;</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
