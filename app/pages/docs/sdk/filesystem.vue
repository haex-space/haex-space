<script setup lang="ts">
import { FolderOpen, Save, FileUp, Image, Code } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.sdkFilesystem.toc.overview'), level: 2 },
  { id: 'save-file', title: t('docs.sdkFilesystem.toc.saveFile'), level: 2 },
  { id: 'open-file', title: t('docs.sdkFilesystem.toc.openFile'), level: 2 },
  { id: 'show-image', title: t('docs.sdkFilesystem.toc.showImage'), level: 2 },
  { id: 'types', title: t('docs.sdkFilesystem.toc.types'), level: 2 },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <!-- Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <NuxtLink to="/docs" class="hover:text-foreground">{{ t('docs.title') }}</NuxtLink>
        <span>/</span>
        <NuxtLink to="/docs/sdk" class="hover:text-foreground">{{ t('docs.nav.sdkReference') }}</NuxtLink>
        <span>/</span>
        <span>{{ t('docs.nav.sdkFilesystem') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.sdkFilesystem.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.sdkFilesystem.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.sdkFilesystem.sections.overview.title')" :icon="FolderOpen">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkFilesystem.sections.overview.intro') }}</p>
      <DocsCodeBlock path="/sdk/filesystem-overview" />

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.sdkFilesystem.sections.overview.note') }}
      </DocsAlert>
    </DocsSection>

    <!-- Save File -->
    <DocsSection id="save-file" :title="t('docs.sdkFilesystem.sections.saveFile.title')" :icon="Save">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkFilesystem.sections.saveFile.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.saveFile.text') }}</h3>
      <DocsCodeBlock path="/sdk/filesystem-save-file" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.saveFile.json') }}</h3>
      <DocsCodeBlock path="/sdk/filesystem-save-json" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.saveFile.binary') }}</h3>
      <DocsCodeBlock path="/sdk/filesystem-save-binary" />
    </DocsSection>

    <!-- Open File -->
    <DocsSection id="open-file" :title="t('docs.sdkFilesystem.sections.openFile.title')" :icon="FileUp">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkFilesystem.sections.openFile.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.openFile.single') }}</h3>
      <DocsCodeBlock path="/sdk/filesystem-open-file" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.openFile.multiple') }}</h3>
      <DocsCodeBlock path="/sdk/filesystem-open-multiple" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.sdkFilesystem.sections.openFile.json') }}</h3>
      <DocsCodeBlock path="/sdk/filesystem-open-json" />
    </DocsSection>

    <!-- Show Image -->
    <DocsSection id="show-image" :title="t('docs.sdkFilesystem.sections.showImage.title')" :icon="Image">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkFilesystem.sections.showImage.intro') }}</p>
      <DocsCodeBlock path="/sdk/filesystem-show-image" />

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.sdkFilesystem.sections.showImage.note') }}
      </DocsAlert>
    </DocsSection>

    <!-- Types -->
    <DocsSection id="types" :title="t('docs.sdkFilesystem.sections.types.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkFilesystem.sections.types.intro') }}</p>
      <DocsCodeBlock path="/sdk/filesystem-types" />
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLink to="/docs/sdk/storage" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.sdkStorage') }}</span>
      </NuxtLink>
      <NuxtLink to="/docs/sdk/web" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.sdkWeb') }}</span>
        <span>&rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>
