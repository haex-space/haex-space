<script setup lang="ts">
import { Apple, Terminal } from 'lucide-vue-next'

const { t } = useI18n()

const { linux: linuxMethods } = useInstallMethods()

const brewCommands = `brew tap haex-space/vault
brew install --cask haex-vault`
</script>

<template>
  <section class="container mx-auto px-4 pb-16">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold mb-2">{{ t('download.installMethods.title') }}</h2>
      <p class="text-muted-foreground max-w-2xl mx-auto">
        {{ t('download.installMethods.subtitle') }}
      </p>
    </div>

    <Tabs default-value="brew" class="max-w-3xl mx-auto">
      <TabsList class="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <TabsTrigger value="brew">
          <Apple class="w-4 h-4 mr-2" />
          Homebrew
        </TabsTrigger>
        <TabsTrigger
          v-for="method in linuxMethods"
          :key="method.key"
          :value="method.key"
        >
          <Terminal class="w-4 h-4 mr-2" />
          {{ method.tabLabel }}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="brew">
        <Card>
          <CardHeader>
            <CardTitle>{{ t('download.installMethods.brew.title') }}</CardTitle>
            <CardDescription>{{ t('download.installMethods.brew.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <DocsCodeBlock language="bash" :code="brewCommands" />
            <p class="text-sm text-muted-foreground mt-4">
              {{ t('download.installMethods.brew.updateNote') }}
              <code class="text-xs bg-muted px-1.5 py-0.5 rounded">brew upgrade --cask haex-vault</code>
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        v-for="method in linuxMethods"
        :key="method.key"
        :value="method.key"
      >
        <Card>
          <CardHeader>
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
      </TabsContent>
    </Tabs>
  </section>
</template>
