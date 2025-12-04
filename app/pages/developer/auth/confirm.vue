<script setup lang="ts">
import { CheckCircle, XCircle, Loader2 } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const store = useMarketplaceStore()

useSeoMeta({
  title: 'Email Verification - haex.space',
  description: 'Verifying your developer email address.',
})

const status = ref<'loading' | 'success' | 'error'>('loading')

onMounted(async () => {
  await store.init()

  // Check if we have hash params (Supabase redirects with hash)
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const accessToken = hashParams.get('access_token')
  const refreshToken = hashParams.get('refresh_token')
  const type = hashParams.get('type')

  if (accessToken && type === 'signup') {
    // Set the session manually
    const { error } = await store.client?.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || ''
    }) ?? { error: new Error('Client not initialized') }

    if (error) {
      status.value = 'error'
    } else {
      status.value = 'success'
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigateTo(localePath('/developer'))
      }, 2000)
    }
  } else if (store.isAuthenticated) {
    status.value = 'success'
    setTimeout(() => {
      navigateTo(localePath('/developer'))
    }, 2000)
  } else {
    status.value = 'error'
  }
})
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <!-- Loading State -->
      <template v-if="status === 'loading'">
        <div class="mx-auto mb-4 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Loader2 class="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
        <CardTitle class="text-2xl">{{ t('developer.auth.confirm.loading.title') }}</CardTitle>
        <CardDescription>
          {{ t('developer.auth.confirm.loading.description') }}
        </CardDescription>
      </template>

      <!-- Success State -->
      <template v-else-if="status === 'success'">
        <div class="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle class="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle class="text-2xl">{{ t('developer.auth.confirm.success.title') }}</CardTitle>
        <CardDescription>
          {{ t('developer.auth.confirm.success.description') }}
        </CardDescription>
      </template>

      <!-- Error State -->
      <template v-else>
        <div class="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle class="w-6 h-6 text-destructive" />
        </div>
        <CardTitle class="text-2xl">{{ t('developer.auth.confirm.error.title') }}</CardTitle>
        <CardDescription>
          {{ t('developer.auth.confirm.error.description') }}
        </CardDescription>
      </template>
    </CardHeader>
    <CardContent v-if="status === 'error'">
      <div class="flex gap-2 justify-center">
        <NuxtLinkLocale to="/developer/auth/register">
          <Button variant="outline">
            {{ t('developer.auth.confirm.error.tryAgain') }}
          </Button>
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/developer/auth/login">
          <Button>
            {{ t('developer.auth.confirm.error.login') }}
          </Button>
        </NuxtLinkLocale>
      </div>
    </CardContent>
  </Card>
</template>
