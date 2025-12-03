<script setup lang="ts">
import { BookOpen, Puzzle, Code, Shield, Rocket, Database, HardDrive, FolderOpen, Globe } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'welcome', title: t('docs.intro.toc.welcome'), level: 2 },
  { id: 'what-is-haex', title: t('docs.intro.toc.whatIsHaex'), level: 2 },
  { id: 'extensions', title: t('docs.intro.toc.extensions'), level: 2 },
  { id: 'getting-started', title: t('docs.intro.toc.gettingStarted'), level: 2 },
]

const features = computed(() => [
  {
    icon: Shield,
    title: t('docs.intro.features.security.title'),
    description: t('docs.intro.features.security.description')
  },
  {
    icon: Database,
    title: t('docs.intro.features.database.title'),
    description: t('docs.intro.features.database.description')
  },
  {
    icon: HardDrive,
    title: t('docs.intro.features.storage.title'),
    description: t('docs.intro.features.storage.description')
  },
  {
    icon: Globe,
    title: t('docs.intro.features.web.title'),
    description: t('docs.intro.features.web.description')
  }
])

const guides = computed(() => [
  {
    icon: Rocket,
    title: t('docs.intro.guides.quickstart.title'),
    description: t('docs.intro.guides.quickstart.description'),
    href: '/docs/quickstart'
  },
  {
    icon: Puzzle,
    title: t('docs.intro.guides.extensions.title'),
    description: t('docs.intro.guides.extensions.description'),
    href: '/docs/extensions'
  },
  {
    icon: Code,
    title: t('docs.intro.guides.sdk.title'),
    description: t('docs.intro.guides.sdk.description'),
    href: '/docs/sdk'
  }
])
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-12">
      <Badge class="mb-4">{{ t('docs.badge') }}</Badge>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.intro.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.intro.subtitle') }}</p>
    </div>

    <!-- Welcome -->
    <DocsSection id="welcome" :title="t('docs.intro.sections.welcome.title')" :icon="BookOpen">
      <p class="text-muted-foreground mb-4">{{ t('docs.intro.sections.welcome.intro') }}</p>
      <p class="text-muted-foreground">{{ t('docs.intro.sections.welcome.content') }}</p>
    </DocsSection>

    <!-- What is haex-vault -->
    <DocsSection id="what-is-haex" :title="t('docs.intro.sections.whatIsHaex.title')" :icon="Shield">
      <p class="text-muted-foreground mb-6">{{ t('docs.intro.sections.whatIsHaex.intro') }}</p>

      <div class="grid md:grid-cols-2 gap-4">
        <Card v-for="feature in features" :key="feature.title">
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <component :is="feature.icon" class="w-4 h-4 text-primary" />
              {{ feature.title }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
          </CardContent>
        </Card>
      </div>
    </DocsSection>

    <!-- Extensions -->
    <DocsSection id="extensions" :title="t('docs.intro.sections.extensions.title')" :icon="Puzzle">
      <p class="text-muted-foreground mb-4">{{ t('docs.intro.sections.extensions.intro') }}</p>
      <p class="text-muted-foreground mb-6">{{ t('docs.intro.sections.extensions.content') }}</p>

      <div class="bg-muted rounded-lg p-6">
        <h4 class="font-medium mb-4">{{ t('docs.intro.sections.extensions.capabilities.title') }}</h4>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li class="flex items-center gap-2">
            <Database class="w-4 h-4 text-primary" />
            {{ t('docs.intro.sections.extensions.capabilities.database') }}
          </li>
          <li class="flex items-center gap-2">
            <HardDrive class="w-4 h-4 text-primary" />
            {{ t('docs.intro.sections.extensions.capabilities.storage') }}
          </li>
          <li class="flex items-center gap-2">
            <FolderOpen class="w-4 h-4 text-primary" />
            {{ t('docs.intro.sections.extensions.capabilities.filesystem') }}
          </li>
          <li class="flex items-center gap-2">
            <Globe class="w-4 h-4 text-primary" />
            {{ t('docs.intro.sections.extensions.capabilities.web') }}
          </li>
          <li class="flex items-center gap-2">
            <Shield class="w-4 h-4 text-primary" />
            {{ t('docs.intro.sections.extensions.capabilities.security') }}
          </li>
        </ul>
      </div>
    </DocsSection>

    <!-- Getting Started -->
    <DocsSection id="getting-started" :title="t('docs.intro.sections.gettingStarted.title')" :icon="Rocket">
      <p class="text-muted-foreground mb-6">{{ t('docs.intro.sections.gettingStarted.intro') }}</p>

      <div class="grid gap-4">
        <NuxtLinkLocale
          v-for="guide in guides"
          :key="guide.href"
          :to="guide.href"
          class="group"
        >
          <Card class="transition-colors hover:border-primary/50">
            <CardContent class="pt-6">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <component :is="guide.icon" class="w-5 h-5 text-primary" />
                </div>
                <div class="flex-1">
                  <h4 class="font-medium mb-1 group-hover:text-primary transition-colors">
                    {{ guide.title }}
                  </h4>
                  <p class="text-sm text-muted-foreground">{{ guide.description }}</p>
                </div>
                <span class="text-muted-foreground group-hover:text-primary transition-colors">&rarr;</span>
              </div>
            </CardContent>
          </Card>
        </NuxtLinkLocale>
      </div>
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-end pt-8 border-t mt-12">
      <NuxtLinkLocale to="/docs/quickstart" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.quickstart') }}</span>
        <span>&rarr;</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
