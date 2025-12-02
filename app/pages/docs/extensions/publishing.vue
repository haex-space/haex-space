<script setup lang="ts">
import { Rocket, Key, Package, Upload, CheckCircle, Shield, FileArchive, Terminal } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.publishing.toc.overview'), level: 2 },
  { id: 'signing', title: t('docs.publishing.toc.signing'), level: 2 },
  { id: 'building', title: t('docs.publishing.toc.building'), level: 2 },
  { id: 'packaging', title: t('docs.publishing.toc.packaging'), level: 2 },
  { id: 'submitting', title: t('docs.publishing.toc.submitting'), level: 2 },
  { id: 'updates', title: t('docs.publishing.toc.updates'), level: 2 },
]

const code = {
  keygen: `# Generate a new keypair
npx haex keygen -o ./haextension

# This creates:
# - haextension/public.key   (share this)
# - haextension/private.key  (keep secret!)`,

  gitignore: `# Add to .gitignore
haextension/private.key`,

  buildAndSign: `# Build your extension (e.g., with Vite)
npm run build

# Sign the built extension
npx haex sign ./dist -k ./haextension/private.key

# This creates: my-extension-1.0.0.xt`,

  packageJson: `{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "ext:sign": "haex sign dist -k ./haextension/private.key",
    "ext:build": "npm run build && npm run ext:sign"
  }
}`,

  signOutput: `$ npx haex sign ./dist -k ./haextension/private.key

✓ Reading manifest from ./dist/haextension/manifest.json
✓ Loading private key
✓ Deriving public key
✓ Creating content hash
✓ Signing extension
✓ Packaging extension

Success! Created my-extension-1.0.0.xt

Extension Details:
  Name: my-extension
  Version: 1.0.0
  Public Key: a1b2c3d4e5f6...
  Signature: 7a8b9c0d1e2f...`,

  manifestVersion: `{
  "name": "my-extension",
  "version": "1.1.0",  // Increment version for updates
  ...
}`
}

const publishingSteps = computed(() => [
  {
    icon: CheckCircle,
    title: t('docs.publishing.steps.test.title'),
    description: t('docs.publishing.steps.test.description')
  },
  {
    icon: FileArchive,
    title: t('docs.publishing.steps.prepare.title'),
    description: t('docs.publishing.steps.prepare.description')
  },
  {
    icon: Upload,
    title: t('docs.publishing.steps.submit.title'),
    description: t('docs.publishing.steps.submit.description')
  },
  {
    icon: Shield,
    title: t('docs.publishing.steps.review.title'),
    description: t('docs.publishing.steps.review.description')
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
        <NuxtLink to="/docs/extensions" class="hover:text-foreground">{{ t('docs.nav.extensions') }}</NuxtLink>
        <span>/</span>
        <span>{{ t('docs.nav.publishing') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.publishing.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.publishing.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.publishing.sections.overview.title')" :icon="Rocket">
      <p class="text-muted-foreground mb-6">{{ t('docs.publishing.sections.overview.intro') }}</p>

      <div class="grid md:grid-cols-2 gap-4">
        <Card v-for="step in publishingSteps" :key="step.title">
          <CardContent class="pt-6">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <component :is="step.icon" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 class="font-medium mb-1">{{ step.title }}</h4>
                <p class="text-sm text-muted-foreground">{{ step.description }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocsSection>

    <!-- Signing -->
    <DocsSection id="signing" :title="t('docs.publishing.sections.signing.title')" :icon="Key">
      <p class="text-muted-foreground mb-6">{{ t('docs.publishing.sections.signing.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.publishing.sections.signing.keygen') }}</h3>
      <p class="text-sm text-muted-foreground mb-3">{{ t('docs.publishing.sections.signing.keygenDesc') }}</p>
      <DocsCodeBlock :code="code.keygen" language="bash" class="mb-6" />

      <DocsAlert type="danger" class="mb-6">
        <strong>{{ t('docs.publishing.sections.signing.warning.title') }}:</strong>
        {{ t('docs.publishing.sections.signing.warning.description') }}
      </DocsAlert>

      <h3 class="font-semibold mb-3">{{ t('docs.publishing.sections.signing.protect') }}</h3>
      <DocsCodeBlock :code="code.gitignore" language="bash" />

      <div class="mt-6 p-4 bg-muted rounded-lg">
        <h4 class="font-medium mb-2">{{ t('docs.publishing.sections.signing.about.title') }}</h4>
        <ul class="text-sm text-muted-foreground space-y-2">
          <li>{{ t('docs.publishing.sections.signing.about.algorithm') }}</li>
          <li>{{ t('docs.publishing.sections.signing.about.publicKey') }}</li>
          <li>{{ t('docs.publishing.sections.signing.about.privateKey') }}</li>
          <li>{{ t('docs.publishing.sections.signing.about.signature') }}</li>
        </ul>
      </div>
    </DocsSection>

    <!-- Building -->
    <DocsSection id="building" :title="t('docs.publishing.sections.building.title')" :icon="Terminal">
      <p class="text-muted-foreground mb-6">{{ t('docs.publishing.sections.building.intro') }}</p>

      <DocsCodeBlock :code="code.buildAndSign" language="bash" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.publishing.sections.building.npm') }}</h3>
      <p class="text-sm text-muted-foreground mb-3">{{ t('docs.publishing.sections.building.npmDesc') }}</p>
      <DocsCodeBlock :code="code.packageJson" language="json" />
    </DocsSection>

    <!-- Packaging -->
    <DocsSection id="packaging" :title="t('docs.publishing.sections.packaging.title')" :icon="Package">
      <p class="text-muted-foreground mb-6">{{ t('docs.publishing.sections.packaging.intro') }}</p>

      <DocsCodeBlock :code="code.signOutput" language="bash" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.publishing.sections.packaging.contents') }}</h3>
      <div class="bg-muted rounded-lg p-4">
        <ul class="text-sm space-y-2 font-mono">
          <li class="flex items-center gap-2">
            <FileArchive class="w-4 h-4 text-primary" />
            <span>my-extension-1.0.0.xt</span>
          </li>
          <li class="pl-6 text-muted-foreground">├── index.html</li>
          <li class="pl-6 text-muted-foreground">├── assets/</li>
          <li class="pl-6 text-muted-foreground">└── haextension/</li>
          <li class="pl-12 text-muted-foreground">├── manifest.json <span class="text-green-500">(signed)</span></li>
          <li class="pl-12 text-muted-foreground">└── public.key</li>
        </ul>
      </div>

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.publishing.sections.packaging.note') }}
      </DocsAlert>
    </DocsSection>

    <!-- Submitting -->
    <DocsSection id="submitting" :title="t('docs.publishing.sections.submitting.title')" :icon="Upload">
      <p class="text-muted-foreground mb-6">{{ t('docs.publishing.sections.submitting.intro') }}</p>

      <div class="space-y-4">
        <DocsStep :number="1" :title="t('docs.publishing.sections.submitting.step1.title')">
          <p class="text-sm text-muted-foreground">{{ t('docs.publishing.sections.submitting.step1.description') }}</p>
        </DocsStep>

        <DocsStep :number="2" :title="t('docs.publishing.sections.submitting.step2.title')">
          <p class="text-sm text-muted-foreground">{{ t('docs.publishing.sections.submitting.step2.description') }}</p>
        </DocsStep>

        <DocsStep :number="3" :title="t('docs.publishing.sections.submitting.step3.title')">
          <p class="text-sm text-muted-foreground">{{ t('docs.publishing.sections.submitting.step3.description') }}</p>
        </DocsStep>

        <DocsStep :number="4" :title="t('docs.publishing.sections.submitting.step4.title')">
          <p class="text-sm text-muted-foreground">{{ t('docs.publishing.sections.submitting.step4.description') }}</p>
        </DocsStep>
      </div>

      <div class="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 class="font-semibold mb-2">{{ t('docs.publishing.sections.submitting.checklist.title') }}</h4>
        <ul class="text-sm space-y-2">
          <li class="flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-green-500" />
            {{ t('docs.publishing.sections.submitting.checklist.item1') }}
          </li>
          <li class="flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-green-500" />
            {{ t('docs.publishing.sections.submitting.checklist.item2') }}
          </li>
          <li class="flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-green-500" />
            {{ t('docs.publishing.sections.submitting.checklist.item3') }}
          </li>
          <li class="flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-green-500" />
            {{ t('docs.publishing.sections.submitting.checklist.item4') }}
          </li>
          <li class="flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-green-500" />
            {{ t('docs.publishing.sections.submitting.checklist.item5') }}
          </li>
        </ul>
      </div>
    </DocsSection>

    <!-- Updates -->
    <DocsSection id="updates" :title="t('docs.publishing.sections.updates.title')" :icon="Rocket">
      <p class="text-muted-foreground mb-6">{{ t('docs.publishing.sections.updates.intro') }}</p>

      <DocsCodeBlock :code="code.manifestVersion" language="json" class="mb-6" />

      <DocsAlert type="warning">
        {{ t('docs.publishing.sections.updates.warning') }}
      </DocsAlert>
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLink to="/docs/extensions/database" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.database') }}</span>
      </NuxtLink>
      <NuxtLink to="/docs/sdk" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.sdkOverview') }}</span>
        <span>&rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>
