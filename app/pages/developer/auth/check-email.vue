<script setup lang="ts">
import { Mail } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()

useSeoMeta({
  title: 'Check Your Email - haex.space',
  description: 'Please check your email to verify your developer account.',
})
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <div class="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Mail class="w-6 h-6 text-primary" />
      </div>
      <CardTitle class="text-2xl">{{ t('developer.auth.checkEmail.title') }}</CardTitle>
      <CardDescription>
        {{ t('developer.auth.checkEmail.description') }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p class="text-sm text-muted-foreground text-center mb-6">
        {{ t('developer.auth.checkEmail.instructions') }}
      </p>
      <div class="pt-4">
        <NuxtLinkLocale to="/developer/auth/login">
          <Button variant="outline" class="w-full">
            {{ t('developer.auth.checkEmail.backToLogin') }}
          </Button>
        </NuxtLinkLocale>
      </div>
    </CardContent>
  </Card>
</template>
