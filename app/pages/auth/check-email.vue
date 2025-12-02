<script setup lang="ts">
import { Mail } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()

useSeoMeta({
  title: 'Check Your Email - haex.space',
  description: 'Please check your email to verify your account.',
})
</script>

<template>
  <Card class="w-full max-w-md text-center">
    <CardHeader>
      <div class="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Mail class="w-8 h-8 text-primary" />
      </div>
      <CardTitle class="text-2xl">{{ t('auth.checkEmail.title') }}</CardTitle>
      <CardDescription>
        {{ t('auth.checkEmail.subtitle') }}
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <p class="text-sm text-muted-foreground">
        {{ t('auth.checkEmail.description') }}
      </p>
      <div class="pt-4">
        <NuxtLink to="/auth/login">
          <Button variant="outline" class="w-full">
            {{ t('auth.checkEmail.backToLogin') }}
          </Button>
        </NuxtLink>
      </div>
    </CardContent>
  </Card>
</template>
