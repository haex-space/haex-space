<script setup lang="ts">
import { Loader2, Eye, EyeOff, RefreshCw, Store } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const marketplaceStore = useMarketplaceStore()

useSeoMeta({
  title: 'Create Account - haex.space',
  description: 'Create your haex.space account to start syncing securely.',
})

// Tab state - check query param for initial tab
const activeTab = ref(route.query.tab === 'marketplace' ? 'marketplace' : 'sync')

// Sync form state
const sync = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  loading: false,
  error: '',
  showPassword: false,
  showConfirmPassword: false,
})

// Marketplace form state
const marketplace = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  loading: false,
  error: '',
  showPassword: false,
  showConfirmPassword: false,
})

const supabase = useSupabaseClient()

async function handleSyncRegister() {
  if (sync.password !== sync.confirmPassword) {
    sync.error = t('auth.register.errors.passwordMismatch')
    return
  }

  if (sync.password.length < 8) {
    sync.error = t('auth.register.errors.passwordTooShort')
    return
  }

  sync.loading = true
  sync.error = ''

  try {
    const { error: signUpError } = await supabase.auth.signUp({
      email: sync.email,
      password: sync.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (signUpError) {
      throw signUpError
    }

    await navigateTo(localePath('/auth/check-email'))
  } catch (e: any) {
    sync.error = e.message || t('auth.register.errors.failed')
  } finally {
    sync.loading = false
  }
}

async function handleMarketplaceRegister() {
  if (marketplace.password !== marketplace.confirmPassword) {
    marketplace.error = t('auth.register.errors.passwordMismatch')
    return
  }

  if (marketplace.password.length < 8) {
    marketplace.error = t('auth.register.errors.passwordTooShort')
    return
  }

  marketplace.loading = true
  marketplace.error = ''

  try {
    await marketplaceStore.signUp(marketplace.email, marketplace.password)
    await navigateTo(localePath('/auth/check-email?type=marketplace'))
  } catch (e: any) {
    marketplace.error = e.message || t('auth.register.errors.failed')
  } finally {
    marketplace.loading = false
  }
}
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">{{ t('auth.register.title') }}</CardTitle>
      <CardDescription>
        {{ t('auth.register.subtitle') }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="sync" class="flex items-center gap-2">
            <RefreshCw class="h-4 w-4" />
            {{ t('auth.register.tabs.sync') }}
          </TabsTrigger>
          <TabsTrigger value="marketplace" class="flex items-center gap-2">
            <Store class="h-4 w-4" />
            {{ t('auth.register.tabs.marketplace') }}
          </TabsTrigger>
        </TabsList>

        <!-- Vault Sync Tab -->
        <TabsContent value="sync">
          <p class="text-sm text-muted-foreground mb-4">
            {{ t('auth.register.syncDescription') }}
          </p>
          <form @submit.prevent="handleSyncRegister" class="space-y-4">
            <div class="space-y-2">
              <Label for="sync-email">{{ t('auth.register.email') }}</Label>
              <Input
                id="sync-email"
                v-model="sync.email"
                type="email"
                :placeholder="t('auth.register.emailPlaceholder')"
                required
                :disabled="sync.loading"
              />
            </div>
            <div class="space-y-2">
              <Label for="sync-password">{{ t('auth.register.password') }}</Label>
              <div class="relative">
                <Input
                  id="sync-password"
                  v-model="sync.password"
                  :type="sync.showPassword ? 'text' : 'password'"
                  :placeholder="t('auth.register.passwordPlaceholder')"
                  required
                  :disabled="sync.loading"
                  class="pr-10"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  @click="sync.showPassword = !sync.showPassword"
                >
                  <Eye v-if="!sync.showPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <Label for="sync-confirmPassword">{{ t('auth.register.confirmPassword') }}</Label>
              <div class="relative">
                <Input
                  id="sync-confirmPassword"
                  v-model="sync.confirmPassword"
                  :type="sync.showConfirmPassword ? 'text' : 'password'"
                  :placeholder="t('auth.register.confirmPasswordPlaceholder')"
                  required
                  :disabled="sync.loading"
                  class="pr-10"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  @click="sync.showConfirmPassword = !sync.showConfirmPassword"
                >
                  <Eye v-if="!sync.showConfirmPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <p v-if="sync.error" class="text-sm text-destructive">
              {{ sync.error }}
            </p>

            <Button type="submit" class="w-full" :disabled="sync.loading">
              <Loader2 v-if="sync.loading" class="w-4 h-4 mr-2 animate-spin" />
              {{ t('auth.register.submit') }}
            </Button>
          </form>

          <div class="mt-6 text-center text-sm text-muted-foreground">
            {{ t('auth.register.hasAccount') }}
            <NuxtLinkLocale to="/auth/login" class="text-primary hover:underline">
              {{ t('auth.register.signIn') }}
            </NuxtLinkLocale>
          </div>
        </TabsContent>

        <!-- Marketplace Tab -->
        <TabsContent value="marketplace">
          <p class="text-sm text-muted-foreground mb-4">
            {{ t('auth.register.marketplaceDescription') }}
          </p>
          <form @submit.prevent="handleMarketplaceRegister" class="space-y-4">
            <div class="space-y-2">
              <Label for="marketplace-email">{{ t('auth.register.email') }}</Label>
              <Input
                id="marketplace-email"
                v-model="marketplace.email"
                type="email"
                :placeholder="t('auth.register.emailPlaceholder')"
                required
                :disabled="marketplace.loading"
              />
            </div>
            <div class="space-y-2">
              <Label for="marketplace-password">{{ t('auth.register.password') }}</Label>
              <div class="relative">
                <Input
                  id="marketplace-password"
                  v-model="marketplace.password"
                  :type="marketplace.showPassword ? 'text' : 'password'"
                  :placeholder="t('auth.register.passwordPlaceholder')"
                  required
                  :disabled="marketplace.loading"
                  class="pr-10"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  @click="marketplace.showPassword = !marketplace.showPassword"
                >
                  <Eye v-if="!marketplace.showPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <Label for="marketplace-confirmPassword">{{ t('auth.register.confirmPassword') }}</Label>
              <div class="relative">
                <Input
                  id="marketplace-confirmPassword"
                  v-model="marketplace.confirmPassword"
                  :type="marketplace.showConfirmPassword ? 'text' : 'password'"
                  :placeholder="t('auth.register.confirmPasswordPlaceholder')"
                  required
                  :disabled="marketplace.loading"
                  class="pr-10"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  @click="marketplace.showConfirmPassword = !marketplace.showConfirmPassword"
                >
                  <Eye v-if="!marketplace.showConfirmPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <p v-if="marketplace.error" class="text-sm text-destructive">
              {{ marketplace.error }}
            </p>

            <Button type="submit" class="w-full" :disabled="marketplace.loading">
              <Loader2 v-if="marketplace.loading" class="w-4 h-4 mr-2 animate-spin" />
              {{ t('auth.register.submit') }}
            </Button>
          </form>

          <div class="mt-6 text-center text-sm text-muted-foreground">
            {{ t('auth.register.hasAccount') }}
            <NuxtLinkLocale to="/auth/login?tab=marketplace" class="text-primary hover:underline">
              {{ t('auth.register.signIn') }}
            </NuxtLinkLocale>
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
</template>
