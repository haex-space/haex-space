<script setup lang="ts">
import { Database, Code, Search, PenLine, Trash2, GitBranch, Layers } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.sdkDatabase.toc.overview'), level: 2 },
  { id: 'query-methods', title: t('docs.sdkDatabase.toc.queryMethods'), level: 2 },
  { id: 'helper-methods', title: t('docs.sdkDatabase.toc.helperMethods'), level: 2 },
  { id: 'transactions', title: t('docs.sdkDatabase.toc.transactions'), level: 2 },
  { id: 'migrations', title: t('docs.sdkDatabase.toc.migrations'), level: 2 },
  { id: 'drizzle', title: t('docs.sdkDatabase.toc.drizzle'), level: 2 },
  { id: 'types', title: t('docs.sdkDatabase.toc.types'), level: 2 },
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
        <span>{{ t('docs.nav.sdkDatabase') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.sdkDatabase.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.sdkDatabase.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.sdkDatabase.sections.overview.title')" :icon="Database">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.overview.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.sdkDatabase.sections.overview.tableName') }}</h3>
      <DocsCodeBlock path="/sdk/database-tablename" />
    </DocsSection>

    <!-- Query Methods -->
    <DocsSection id="query-methods" :title="t('docs.sdkDatabase.sections.queryMethods.title')" :icon="Search">
      <h3 class="font-semibold mb-3">query()</h3>
      <DocsCodeBlock path="/sdk/database-query" class="mb-6" />

      <h3 class="font-semibold mb-3">select()</h3>
      <DocsCodeBlock path="/sdk/database-select" class="mb-6" />

      <h3 class="font-semibold mb-3">execute()</h3>
      <DocsCodeBlock path="/sdk/database-execute" />

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.sdkDatabase.sections.queryMethods.note') }}
      </DocsAlert>
    </DocsSection>

    <!-- Helper Methods -->
    <DocsSection id="helper-methods" :title="t('docs.sdkDatabase.sections.helperMethods.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.helperMethods.intro') }}</p>

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <PenLine class="w-4 h-4 text-primary" />
        insert()
      </h3>
      <DocsCodeBlock path="/sdk/database-insert" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <PenLine class="w-4 h-4 text-primary" />
        update()
      </h3>
      <DocsCodeBlock path="/sdk/database-update" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <Trash2 class="w-4 h-4 text-primary" />
        delete()
      </h3>
      <DocsCodeBlock path="/sdk/database-delete" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <Search class="w-4 h-4 text-primary" />
        count()
      </h3>
      <DocsCodeBlock path="/sdk/database-count" />
    </DocsSection>

    <!-- Transactions -->
    <DocsSection id="transactions" :title="t('docs.sdkDatabase.sections.transactions.title')" :icon="GitBranch">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.transactions.intro') }}</p>
      <DocsCodeBlock path="/sdk/database-transaction" />

      <DocsAlert type="warning" class="mt-6">
        {{ t('docs.sdkDatabase.sections.transactions.warning') }}
      </DocsAlert>
    </DocsSection>

    <!-- Migrations -->
    <DocsSection id="migrations" :title="t('docs.sdkDatabase.sections.migrations.title')" :icon="GitBranch">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.migrations.intro') }}</p>
      <DocsCodeBlock path="/sdk/database-migrations" />
    </DocsSection>

    <!-- Drizzle ORM -->
    <DocsSection id="drizzle" :title="t('docs.sdkDatabase.sections.drizzle.title')" :icon="Layers">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.drizzle.intro') }}</p>
      <DocsCodeBlock path="/sdk/database-drizzle" />
    </DocsSection>

    <!-- Types -->
    <DocsSection id="types" :title="t('docs.sdkDatabase.sections.types.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.types.intro') }}</p>
      <DocsCodeBlock path="/sdk/database-types" />
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLink to="/docs/sdk" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.sdkOverview') }}</span>
      </NuxtLink>
      <NuxtLink to="/docs/sdk/storage" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.sdkStorage') }}</span>
        <span>&rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>
