<script setup lang="ts">
import privacyDe from '~/assets/legal/privacy.de.md?raw'
import privacyEn from '~/assets/legal/privacy.en.md?raw'

const { locale, t } = useI18n()

const content = computed(() => (locale.value === 'de' ? privacyDe : privacyEn))

useSeoMeta({
  title: () => `${t('common.privacy')} – haex.space`,
})
</script>

<template>
  <LegalArticle>
    <MDC :value="content" />
  </LegalArticle>
</template>
