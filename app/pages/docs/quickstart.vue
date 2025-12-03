<script setup lang="ts">
import { Rocket, Download, Terminal, Code, Play, CheckCircle } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.quickstart.toc.overview'), level: 2 },
  { id: 'prerequisites', title: t('docs.quickstart.toc.prerequisites'), level: 2 },
  { id: 'create-project', title: t('docs.quickstart.toc.createProject'), level: 2 },
  { id: 'run-extension', title: t('docs.quickstart.toc.runExtension'), level: 2 },
  { id: 'next-steps', title: t('docs.quickstart.toc.nextSteps'), level: 2 },
]

// Content paths for code examples
const paths = {
  createProjectNpm: '/quickstart/create-project-npm',
  createProjectPnpm: '/quickstart/create-project-pnpm',
  createProjectYarn: '/quickstart/create-project-yarn',
  createProjectBun: '/quickstart/create-project-bun',
  mainTs: '/quickstart/main-ts',
  appVue: '/quickstart/app-vue',
  runDev: '/quickstart/run-dev',
  buildSign: '/quickstart/build-sign'
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <NuxtLinkLocale to="/docs" class="hover:text-foreground">{{ t('docs.title') }}</NuxtLinkLocale>
        <span>/</span>
        <span>{{ t('docs.nav.quickstart') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.quickstart.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.quickstart.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.quickstart.sections.overview.title')" :icon="Rocket">
      <p class="text-muted-foreground mb-4">{{ t('docs.quickstart.sections.overview.intro') }}</p>

      <div class="flex items-center gap-4 p-4 bg-muted rounded-lg">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">5</div>
          <span class="text-sm text-muted-foreground">{{ t('docs.quickstart.sections.overview.minutes') }}</span>
        </div>
        <div class="h-8 w-px bg-border" />
        <div class="flex items-center gap-2">
          <Terminal class="w-4 h-4 text-muted-foreground" />
          <span class="text-sm text-muted-foreground">{{ t('docs.quickstart.sections.overview.commands') }}</span>
        </div>
      </div>
    </DocsSection>

    <!-- Prerequisites -->
    <DocsSection id="prerequisites" :title="t('docs.quickstart.sections.prerequisites.title')" :icon="CheckCircle">
      <p class="text-muted-foreground mb-6">{{ t('docs.quickstart.sections.prerequisites.intro') }}</p>

      <div class="space-y-4">
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle class="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 class="font-medium">Node.js 18+</h4>
                <p class="text-sm text-muted-foreground">{{ t('docs.quickstart.sections.prerequisites.node') }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle class="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 class="font-medium">haex-vault</h4>
                <p class="text-sm text-muted-foreground">
                  {{ t('docs.quickstart.sections.prerequisites.vault') }}
                  <NuxtLinkLocale to="/download" class="text-primary hover:underline ml-1">
                    {{ t('docs.quickstart.sections.prerequisites.download') }}
                  </NuxtLinkLocale>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocsSection>

    <!-- Create Project -->
    <DocsSection id="create-project" :title="t('docs.quickstart.sections.createProject.title')" :icon="Terminal">
      <p class="text-muted-foreground mb-6">{{ t('docs.quickstart.sections.createProject.intro') }}</p>

      <DocsStep :number="1" :title="t('docs.quickstart.sections.createProject.step1.title')">
        <p class="text-sm text-muted-foreground mb-3">{{ t('docs.quickstart.sections.createProject.step1.description') }}</p>
        <Tabs default-value="npm">
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
            <DocsCodeBlock :path="paths.createProjectNpm" />
          </TabsContent>
          <TabsContent value="pnpm" class="mt-4">
            <DocsCodeBlock :path="paths.createProjectPnpm" />
          </TabsContent>
          <TabsContent value="yarn" class="mt-4">
            <DocsCodeBlock :path="paths.createProjectYarn" />
          </TabsContent>
          <TabsContent value="bun" class="mt-4">
            <DocsCodeBlock :path="paths.createProjectBun" />
          </TabsContent>
        </Tabs>
      </DocsStep>

      <DocsStep :number="2" :title="t('docs.quickstart.sections.createProject.step2.title')" class="mt-6">
        <p class="text-sm text-muted-foreground mb-3">{{ t('docs.quickstart.sections.createProject.step2.description') }}</p>
        <DocsCodeBlock :path="paths.mainTs" />
      </DocsStep>

      <DocsStep :number="3" :title="t('docs.quickstart.sections.createProject.step3.title')" class="mt-6">
        <p class="text-sm text-muted-foreground mb-3">{{ t('docs.quickstart.sections.createProject.step3.description') }}</p>
        <DocsCodeBlock :path="paths.appVue" />
      </DocsStep>

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.quickstart.sections.createProject.note') }}
      </DocsAlert>
    </DocsSection>

    <!-- Run Extension -->
    <DocsSection id="run-extension" :title="t('docs.quickstart.sections.runExtension.title')" :icon="Play">
      <p class="text-muted-foreground mb-6">{{ t('docs.quickstart.sections.runExtension.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.quickstart.sections.runExtension.dev') }}</h3>
      <DocsCodeBlock :path="paths.runDev" class="mb-6" />

      <p class="text-muted-foreground mb-6">{{ t('docs.quickstart.sections.runExtension.loadInVault') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.quickstart.sections.runExtension.build') }}</h3>
      <DocsCodeBlock :path="paths.buildSign" />

      <DocsAlert type="warning" class="mt-6">
        {{ t('docs.quickstart.sections.runExtension.warning') }}
      </DocsAlert>
    </DocsSection>

    <!-- Next Steps -->
    <DocsSection id="next-steps" :title="t('docs.quickstart.sections.nextSteps.title')" :icon="Rocket">
      <p class="text-muted-foreground mb-6">{{ t('docs.quickstart.sections.nextSteps.intro') }}</p>

      <div class="grid md:grid-cols-2 gap-4">
        <NuxtLinkLocale to="/docs/extensions" class="group">
          <Card class="h-full transition-colors hover:border-primary/50">
            <CardContent class="pt-6">
              <h4 class="font-medium mb-2 group-hover:text-primary transition-colors">
                {{ t('docs.quickstart.sections.nextSteps.extensions.title') }}
              </h4>
              <p class="text-sm text-muted-foreground">
                {{ t('docs.quickstart.sections.nextSteps.extensions.description') }}
              </p>
            </CardContent>
          </Card>
        </NuxtLinkLocale>

        <NuxtLinkLocale to="/docs/sdk" class="group">
          <Card class="h-full transition-colors hover:border-primary/50">
            <CardContent class="pt-6">
              <h4 class="font-medium mb-2 group-hover:text-primary transition-colors">
                {{ t('docs.quickstart.sections.nextSteps.sdk.title') }}
              </h4>
              <p class="text-sm text-muted-foreground">
                {{ t('docs.quickstart.sections.nextSteps.sdk.description') }}
              </p>
            </CardContent>
          </Card>
        </NuxtLinkLocale>

        <NuxtLinkLocale to="/docs/extensions/database" class="group">
          <Card class="h-full transition-colors hover:border-primary/50">
            <CardContent class="pt-6">
              <h4 class="font-medium mb-2 group-hover:text-primary transition-colors">
                {{ t('docs.quickstart.sections.nextSteps.database.title') }}
              </h4>
              <p class="text-sm text-muted-foreground">
                {{ t('docs.quickstart.sections.nextSteps.database.description') }}
              </p>
            </CardContent>
          </Card>
        </NuxtLinkLocale>

        <NuxtLinkLocale to="/docs/extensions/publishing" class="group">
          <Card class="h-full transition-colors hover:border-primary/50">
            <CardContent class="pt-6">
              <h4 class="font-medium mb-2 group-hover:text-primary transition-colors">
                {{ t('docs.quickstart.sections.nextSteps.publishing.title') }}
              </h4>
              <p class="text-sm text-muted-foreground">
                {{ t('docs.quickstart.sections.nextSteps.publishing.description') }}
              </p>
            </CardContent>
          </Card>
        </NuxtLinkLocale>
      </div>
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLinkLocale to="/docs" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.introduction') }}</span>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/docs/extensions" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.buildExtension') }}</span>
        <span>&rarr;</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
