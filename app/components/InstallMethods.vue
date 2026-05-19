<script setup lang="ts">
import { Apple, Terminal } from 'lucide-vue-next'

const { t } = useI18n()

const aptCommands = `# 1. Trust the repo signing key
sudo install -d -m 0755 /etc/apt/keyrings
curl -fsSL https://apt.haex.space/pubkey.gpg \\
  | sudo tee /etc/apt/keyrings/haex-vault.asc > /dev/null

# 2. Add the repository
echo "deb [signed-by=/etc/apt/keyrings/haex-vault.asc] https://apt.haex.space stable main" \\
  | sudo tee /etc/apt/sources.list.d/haex-vault.list > /dev/null

# 3. Install
sudo apt update
sudo apt install haex-vault`

const dnfCommands = `# 1. Trust the repo signing key
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

const zypperCommands = `sudo rpm --import https://rpm.haex.space/pubkey.gpg
sudo zypper addrepo --gpgcheck --refresh \\
  https://rpm.haex.space/ haex-vault
sudo zypper install haex-vault`

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
      <TabsList class="grid w-full grid-cols-4">
        <TabsTrigger value="brew">
          <Apple class="w-4 h-4 mr-2" />
          Homebrew
        </TabsTrigger>
        <TabsTrigger value="apt">
          <Terminal class="w-4 h-4 mr-2" />
          APT
        </TabsTrigger>
        <TabsTrigger value="dnf">
          <Terminal class="w-4 h-4 mr-2" />
          DNF/YUM
        </TabsTrigger>
        <TabsTrigger value="zypper">
          <Terminal class="w-4 h-4 mr-2" />
          Zypper
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

      <TabsContent value="apt">
        <Card>
          <CardHeader>
            <CardTitle>{{ t('download.installMethods.apt.title') }}</CardTitle>
            <CardDescription>{{ t('download.installMethods.apt.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <DocsCodeBlock language="bash" :code="aptCommands" />
            <p class="text-sm text-muted-foreground mt-4">
              {{ t('download.installMethods.apt.updateNote') }}
              <code class="text-xs bg-muted px-1.5 py-0.5 rounded">sudo apt update && sudo apt upgrade</code>
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dnf">
        <Card>
          <CardHeader>
            <CardTitle>{{ t('download.installMethods.dnf.title') }}</CardTitle>
            <CardDescription>{{ t('download.installMethods.dnf.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <DocsCodeBlock language="bash" :code="dnfCommands" />
            <p class="text-sm text-muted-foreground mt-4">
              {{ t('download.installMethods.dnf.updateNote') }}
              <code class="text-xs bg-muted px-1.5 py-0.5 rounded">sudo dnf upgrade haex-vault</code>
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="zypper">
        <Card>
          <CardHeader>
            <CardTitle>{{ t('download.installMethods.zypper.title') }}</CardTitle>
            <CardDescription>{{ t('download.installMethods.zypper.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <DocsCodeBlock language="bash" :code="zypperCommands" />
            <p class="text-sm text-muted-foreground mt-4">
              {{ t('download.installMethods.zypper.updateNote') }}
              <code class="text-xs bg-muted px-1.5 py-0.5 rounded">sudo zypper update haex-vault</code>
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </section>
</template>
