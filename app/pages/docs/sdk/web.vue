<script setup lang="ts">
import { Globe, Code, ExternalLink, FileJson, FileText, Image } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.sdkWeb.toc.overview'), level: 2 },
  { id: 'fetch', title: t('docs.sdkWeb.toc.fetch'), level: 2 },
  { id: 'convenience-methods', title: t('docs.sdkWeb.toc.convenienceMethods'), level: 2 },
  { id: 'open-url', title: t('docs.sdkWeb.toc.openUrl'), level: 2 },
  { id: 'permissions', title: t('docs.sdkWeb.toc.permissions'), level: 2 },
  { id: 'types', title: t('docs.sdkWeb.toc.types'), level: 2 },
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
        <span>{{ t('docs.nav.sdkWeb') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.sdkWeb.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.sdkWeb.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.sdkWeb.sections.overview.title')" :icon="Globe">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.overview.intro') }}</p>
      <DocsCodeBlock path="/sdk/web-overview" />

      <DocsAlert type="warning" class="mt-6">
        {{ t('docs.sdkWeb.sections.overview.warning') }}
      </DocsAlert>
    </DocsSection>

    <!-- Fetch -->
    <DocsSection id="fetch" :title="t('docs.sdkWeb.sections.fetch.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.fetch.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.sdkWeb.sections.fetch.basic') }}</h3>
      <DocsCodeBlock path="/sdk/web-fetch" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkWeb.sections.fetch.headers') }}</h3>
      <DocsCodeBlock path="/sdk/web-fetch-headers" />
    </DocsSection>

    <!-- Convenience Methods -->
    <DocsSection id="convenience-methods" :title="t('docs.sdkWeb.sections.convenienceMethods.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.convenienceMethods.intro') }}</p>

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <FileJson class="w-4 h-4 text-primary" />
        fetchJsonAsync()
      </h3>
      <DocsCodeBlock path="/sdk/web-fetch-json" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <FileText class="w-4 h-4 text-primary" />
        fetchTextAsync()
      </h3>
      <DocsCodeBlock path="/sdk/web-fetch-text" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <Image class="w-4 h-4 text-primary" />
        fetchBlobAsync()
      </h3>
      <DocsCodeBlock path="/sdk/web-fetch-blob" />
    </DocsSection>

    <!-- Open URL -->
    <DocsSection id="open-url" :title="t('docs.sdkWeb.sections.openUrl.title')" :icon="ExternalLink">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.openUrl.intro') }}</p>
      <DocsCodeBlock path="/sdk/web-open-url" />
    </DocsSection>

    <!-- Permissions -->
    <DocsSection id="permissions" :title="t('docs.sdkWeb.sections.permissions.title')" :icon="Globe">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.permissions.intro') }}</p>
      <DocsCodeBlock path="/sdk/web-permissions" />

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.sdkWeb.sections.permissions.note') }}
        <NuxtLinkLocale to="/docs/extensions/permissions" class="underline hover:no-underline ml-1">
          {{ t('docs.sdkWeb.sections.permissions.learnMore') }}
        </NuxtLinkLocale>
      </DocsAlert>
    </DocsSection>

    <!-- Types -->
    <DocsSection id="types" :title="t('docs.sdkWeb.sections.types.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkWeb.sections.types.intro') }}</p>
      <DocsCodeBlock path="/sdk/web-types" />
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLinkLocale to="/docs/sdk/filesystem" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.sdkFilesystem') }}</span>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/docs" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.introduction') }}</span>
        <span>&rarr;</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
