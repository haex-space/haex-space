<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: 'Login - haex.space',
  description: 'Sign in to your haex.space account.',
})

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const supabase = useSupabaseClient()

async function handleLogin() {
  isLoading.value = true
  error.value = ''

  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (signInError) {
      throw signInError
    }

    await navigateTo(localePath('/dashboard'))
  } catch (e: any) {
    error.value = e.message || t('auth.login.errors.failed')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Card class="w-full max-w-md">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">{{ t('auth.login.title') }}</CardTitle>
          <CardDescription>
            {{ t('auth.login.subtitle') }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <Label for="email">{{ t('auth.login.email') }}</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                :placeholder="t('auth.login.emailPlaceholder')"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="space-y-2">
              <Label for="password">{{ t('auth.login.password') }}</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                :placeholder="t('auth.login.passwordPlaceholder')"
                required
                :disabled="isLoading"
              />
            </div>

            <p v-if="error" class="text-sm text-destructive">
              {{ error }}
            </p>

            <Button type="submit" class="w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              {{ t('auth.login.submit') }}
            </Button>
          </form>

          <div class="mt-6 text-center text-sm text-muted-foreground">
            {{ t('auth.login.noAccount') }}
            <NuxtLinkLocale to="/auth/register" class="text-primary hover:underline">
              {{ t('auth.login.signUp') }}
            </NuxtLinkLocale>
          </div>
        </CardContent>
  </Card>
</template>
