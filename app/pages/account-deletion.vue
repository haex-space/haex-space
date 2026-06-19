<script setup lang="ts">
import accountDeletionDe from '~/assets/legal/account-deletion.de.md?raw'
import accountDeletionEn from '~/assets/legal/account-deletion.en.md?raw'

const { locale, t } = useI18n()

const content = computed(() => (locale.value === 'de' ? accountDeletionDe : accountDeletionEn))

useSeoMeta({
  title: () => `${t('common.accountDeletion')} – haex.space`,
})
</script>

<template>
  <LegalArticle>
    <MDC :value="content" />
  </LegalArticle>
</template>
