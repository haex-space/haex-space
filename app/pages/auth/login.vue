<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

const { t } = useI18n()

useSeoMeta({
  title: 'Login - haex.space',
  description: 'Sign in to your haex.space account.',
})

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

async function handleLogin() {
  isLoading.value = true
  error.value = ''

  try {
    // TODO: Implement Supabase Auth
    console.log('Login:', email.value, password.value)
    await navigateTo('/')
  } catch (e: any) {
    error.value = e.message || t('auth.login.errors.failed')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-border">
      <nav class="container mx-auto px-4 h-16 flex items-center">
        <NuxtLink to="/" class="text-xl font-bold">
          haex.space
        </NuxtLink>
      </nav>
    </header>

    <main class="flex-1 flex items-center justify-center p-4">
      <ShadcnCard class="w-full max-w-md">
        <ShadcnCardHeader class="text-center">
          <ShadcnCardTitle class="text-2xl">{{ t('auth.login.title') }}</ShadcnCardTitle>
          <ShadcnCardDescription>
            {{ t('auth.login.subtitle') }}
          </ShadcnCardDescription>
        </ShadcnCardHeader>
        <ShadcnCardContent>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <ShadcnLabel for="email">{{ t('auth.login.email') }}</ShadcnLabel>
              <ShadcnInput
                id="email"
                v-model="email"
                type="email"
                :placeholder="t('auth.login.emailPlaceholder')"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="space-y-2">
              <ShadcnLabel for="password">{{ t('auth.login.password') }}</ShadcnLabel>
              <UiInputPassword
                id="password"
                v-model="password"
                :placeholder="t('auth.login.passwordPlaceholder')"
                required
                :disabled="isLoading"
              />
            </div>

            <p v-if="error" class="text-sm text-destructive">
              {{ error }}
            </p>

            <ShadcnButton type="submit" class="w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              {{ t('auth.login.submit') }}
            </ShadcnButton>
          </form>

          <div class="mt-6 text-center text-sm text-muted-foreground">
            {{ t('auth.login.noAccount') }}
            <NuxtLink to="/auth/register" class="text-primary hover:underline">
              {{ t('auth.login.signUp') }}
            </NuxtLink>
          </div>
        </ShadcnCardContent>
      </ShadcnCard>
    </main>
  </div>
</template>
