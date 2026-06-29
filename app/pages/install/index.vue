<script setup lang="ts">
import { ExternalLink, Download } from 'lucide-vue-next'

const { t } = useI18n()

useSeoMeta({
  title: () => t('install.seo.title'),
  description: () => t('install.seo.description'),
})

const { linux: linuxMethods } = useInstallMethods()

const brewCmd = `brew tap haex-space/vault
brew install --cask haex-vault`

const appimageCmd = `# Make executable and run — no install needed
chmod +x Haex.Vault_*.AppImage
./Haex.Vault_*.AppImage`
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="container mx-auto px-4 py-16 text-center">
      <Badge variant="secondary" class="mb-4">
        {{ t('install.badge') }}
      </Badge>
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {{ t('install.title') }}
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        {{ t('install.subtitle') }}
      </p>
    </section>

    <!-- Platform Tabs -->
    <section class="container mx-auto px-4 pb-16">
      <Tabs default-value="macos" class="max-w-4xl mx-auto">
        <TabsList class="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
          <TabsTrigger value="macos">
            <Icon name="mdi:apple" class="w-4 h-4 mr-2" />
            macOS
          </TabsTrigger>
          <TabsTrigger value="linux">
            <Icon name="mdi:linux" class="w-4 h-4 mr-2" />
            Linux
          </TabsTrigger>
          <TabsTrigger value="windows">
            <Icon name="mdi:microsoft-windows" class="w-4 h-4 mr-2" />
            Windows
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Icon name="mdi:cellphone" class="w-4 h-4 mr-2" />
            {{ t('install.mobile.tab') }}
          </TabsTrigger>
        </TabsList>

        <!-- macOS -->
        <TabsContent value="macos" class="space-y-6">
          <Card>
            <CardHeader>
              <Badge variant="default" class="w-fit mb-2">{{ t('install.recommended') }}</Badge>
              <CardTitle>{{ t('install.macos.brew.title') }}</CardTitle>
              <CardDescription>{{ t('install.macos.brew.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <DocsCodeBlock language="bash" :code="brewCmd" />
              <p class="text-sm text-muted-foreground mt-4">
                {{ t('install.macos.brew.updateNote') }}
                <code class="text-xs bg-muted px-1.5 py-0.5 rounded">brew upgrade --cask haex-vault</code>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{{ t('install.macos.dmg.title') }}</CardTitle>
              <CardDescription>{{ t('install.macos.dmg.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <NuxtLinkLocale to="/download" class="inline-flex">
                <Button variant="outline" class="gap-2">
                  <Download class="w-4 h-4" />
                  {{ t('install.macos.dmg.button') }}
                </Button>
              </NuxtLinkLocale>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Linux -->
        <TabsContent value="linux" class="space-y-6">
          <Card v-for="method in linuxMethods" :key="method.key">
            <CardHeader>
              <Badge
                v-if="method.key === 'apt'"
                variant="default"
                class="w-fit mb-2"
              >{{ t('install.recommended') }}</Badge>
              <CardTitle>{{ t(`${method.i18nBase}.title`) }}</CardTitle>
              <CardDescription>{{ t(`${method.i18nBase}.description`) }}</CardDescription>
            </CardHeader>
            <CardContent>
              <DocsCodeBlock language="bash" :code="method.snippet" />
              <p class="text-sm text-muted-foreground mt-4">
                {{ t(`${method.i18nBase}.updateNote`) }}
                <code class="text-xs bg-muted px-1.5 py-0.5 rounded">{{ method.updateCmd }}</code>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{{ t('install.linux.appimage.title') }}</CardTitle>
              <CardDescription>{{ t('install.linux.appimage.description') }}</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <DocsCodeBlock language="bash" :code="appimageCmd" />
              <NuxtLinkLocale to="/download" class="inline-flex">
                <Button variant="outline" class="gap-2">
                  <Download class="w-4 h-4" />
                  {{ t('install.linux.appimage.button') }}
                </Button>
              </NuxtLinkLocale>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Windows -->
        <TabsContent value="windows" class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{{ t('install.windows.installer.title') }}</CardTitle>
              <CardDescription>{{ t('install.windows.installer.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <NuxtLinkLocale to="/download" class="inline-flex">
                <Button variant="outline" class="gap-2">
                  <Download class="w-4 h-4" />
                  {{ t('install.windows.installer.button') }}
                </Button>
              </NuxtLinkLocale>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{{ t('install.windows.winget.title') }}</CardTitle>
              <CardDescription>{{ t('install.windows.winget.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{{ t('install.comingSoon') }}</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Mobile -->
        <TabsContent value="mobile" class="space-y-6">
          <Card>
            <CardHeader>
              <div class="flex items-center gap-2">
                <Icon name="mdi:android" class="w-5 h-5" />
                <CardTitle>{{ t('install.mobile.android.title') }}</CardTitle>
              </div>
              <CardDescription>{{ t('install.mobile.android.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <NuxtLinkLocale to="/download" class="inline-flex">
                <Button variant="outline" class="gap-2">
                  <Download class="w-4 h-4" />
                  {{ t('install.mobile.android.button') }}
                </Button>
              </NuxtLinkLocale>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div class="flex items-center gap-2">
                <Icon name="mdi:apple-ios" class="w-5 h-5" />
                <CardTitle>{{ t('install.mobile.ios.title') }}</CardTitle>
              </div>
              <CardDescription>{{ t('install.mobile.ios.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{{ t('install.comingSoon') }}</Badge>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <!-- Footer note linking to raw downloads -->
      <div class="max-w-4xl mx-auto mt-12 text-center">
        <p class="text-sm text-muted-foreground">
          {{ t('install.rawBinariesNote') }}
          <NuxtLinkLocale to="/download" class="text-primary hover:underline inline-flex items-center gap-1">
            {{ t('install.rawBinariesLink') }}
            <ExternalLink class="w-3 h-3" />
          </NuxtLinkLocale>
        </p>
      </div>
    </section>
  </div>
</template>
