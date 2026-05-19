<script setup lang="ts">
import { ExternalLink, Download } from 'lucide-vue-next'

const { t } = useI18n()

useSeoMeta({
  title: () => t('install.seo.title'),
  description: () => t('install.seo.description'),
})

const brewCmd = `brew tap haex-space/vault
brew install --cask haex-vault`

const aptCmd = `# 1. Trust the repo signing key
sudo install -d -m 0755 /etc/apt/keyrings
curl -fsSL https://apt.haex.space/pubkey.gpg \\
  | sudo tee /etc/apt/keyrings/haex-vault.asc > /dev/null

# 2. Add the repository
echo "deb [signed-by=/etc/apt/keyrings/haex-vault.asc] https://apt.haex.space stable main" \\
  | sudo tee /etc/apt/sources.list.d/haex-vault.list > /dev/null

# 3. Install
sudo apt update
sudo apt install haex-vault`

const dnfCmd = `# 1. Trust the repo signing key
sudo rpm --import https://rpm.haex.space/pubkey.gpg

# 2. Add the repository
sudo tee /etc/yum.repos.d/haex-vault.repo > /dev/null <<'EOF'
[haex-vault]
name=Haex Vault
baseurl=https://rpm.haex.space/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://rpm.haex.space/pubkey.gpg
EOF

# 3. Install
sudo dnf install haex-vault`

const zypperCmd = `sudo rpm --import https://rpm.haex.space/pubkey.gpg
sudo zypper addrepo --gpgcheck --refresh \\
  https://rpm.haex.space/ haex-vault
sudo zypper install haex-vault`

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
          <Card>
            <CardHeader>
              <Badge variant="default" class="w-fit mb-2">{{ t('install.recommended') }}</Badge>
              <CardTitle>{{ t('install.linux.apt.title') }}</CardTitle>
              <CardDescription>{{ t('install.linux.apt.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <DocsCodeBlock language="bash" :code="aptCmd" />
              <p class="text-sm text-muted-foreground mt-4">
                {{ t('install.linux.apt.updateNote') }}
                <code class="text-xs bg-muted px-1.5 py-0.5 rounded">sudo apt update && sudo apt upgrade</code>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{{ t('install.linux.dnf.title') }}</CardTitle>
              <CardDescription>{{ t('install.linux.dnf.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <DocsCodeBlock language="bash" :code="dnfCmd" />
              <p class="text-sm text-muted-foreground mt-4">
                {{ t('install.linux.dnf.updateNote') }}
                <code class="text-xs bg-muted px-1.5 py-0.5 rounded">sudo dnf upgrade haex-vault</code>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{{ t('install.linux.zypper.title') }}</CardTitle>
              <CardDescription>{{ t('install.linux.zypper.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <DocsCodeBlock language="bash" :code="zypperCmd" />
              <p class="text-sm text-muted-foreground mt-4">
                {{ t('install.linux.zypper.updateNote') }}
                <code class="text-xs bg-muted px-1.5 py-0.5 rounded">sudo zypper update haex-vault</code>
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
