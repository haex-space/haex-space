<script setup lang="ts">
import { CheckCircle, XCircle, Loader2 } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const marketplaceStore = useMarketplaceStore()

// Determine account type from query param
const isMarketplace = computed(() => route.query.type === 'marketplace')

useSeoMeta({
  title: 'Email Verification - haex.space',
  description: 'Verifying your email address.',
})

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('')

onMounted(async () => {
  if (isMarketplace.value) {
    // Marketplace account verification
    await marketplaceStore.init()

    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type = hashParams.get('type')

    if (accessToken && type === 'signup') {
      const { error } = await marketplaceStore.client?.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || ''
      }) ?? { error: new Error('Client not initialized') }

      if (error) {
        status.value = 'error'
        errorMessage.value = error.message || t('auth.confirm.errors.failed')
      } else {
        status.value = 'success'
        setTimeout(() => {
          navigateTo(localePath('/developer'))
        }, 2000)
      }
    } else if (marketplaceStore.isAuthenticated) {
      status.value = 'success'
      setTimeout(() => {
        navigateTo(localePath('/developer'))
      }, 2000)
    } else {
      status.value = 'error'
      errorMessage.value = t('auth.confirm.errors.noSession')
    }
  } else {
    // Vault Sync account verification
    const supabase = useSupabaseClient()

    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      if (session) {
        status.value = 'success'
        setTimeout(() => {
          navigateTo(localePath('/dashboard'))
        }, 2000)
      } else {
        status.value = 'error'
        errorMessage.value = t('auth.confirm.errors.noSession')
      }
    } catch (e: any) {
      status.value = 'error'
      errorMessage.value = e.message || t('auth.confirm.errors.failed')
    }
  }
})
</script>

<template>
  <Card class="w-full max-w-md text-center">
    <CardHeader>
      <!-- Loading State -->
      <template v-if="status === 'loading'">
        <div class="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Loader2 class="w-8 h-8 text-muted-foreground animate-spin" />
        </div>
        <CardTitle class="text-2xl">{{ t('auth.confirm.loading.title') }}</CardTitle>
        <CardDescription>
          {{ t('auth.confirm.loading.subtitle') }}
        </CardDescription>
      </template>

      <!-- Success State -->
      <template v-else-if="status === 'success'">
        <div class="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle class="w-8 h-8 text-green-500" />
        </div>
        <CardTitle class="text-2xl">{{ t('auth.confirm.success.title') }}</CardTitle>
        <CardDescription>
          {{ t('auth.confirm.success.subtitle') }}
        </CardDescription>
      </template>

      <!-- Error State -->
      <template v-else>
        <div class="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <XCircle class="w-8 h-8 text-destructive" />
        </div>
        <CardTitle class="text-2xl">{{ t('auth.confirm.error.title') }}</CardTitle>
        <CardDescription>
          {{ errorMessage }}
        </CardDescription>
      </template>
    </CardHeader>
    <CardContent>
      <template v-if="status === 'success'">
        <p class="text-sm text-muted-foreground">
          {{ t('auth.confirm.success.redirecting') }}
        </p>
      </template>
      <template v-else-if="status === 'error'">
        <div class="space-y-4">
          <p class="text-sm text-muted-foreground">
            {{ t('auth.confirm.error.description') }}
          </p>
          <div class="flex gap-2 justify-center">
            <NuxtLinkLocale :to="isMarketplace ? '/auth/register?tab=marketplace' : '/auth/register'">
              <Button variant="outline">
                {{ t('auth.confirm.error.tryAgain') }}
              </Button>
            </NuxtLinkLocale>
            <NuxtLinkLocale :to="isMarketplace ? '/auth/login?tab=marketplace' : '/auth/login'">
              <Button>
                {{ t('auth.confirm.error.login') }}
              </Button>
            </NuxtLinkLocale>
          </div>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
