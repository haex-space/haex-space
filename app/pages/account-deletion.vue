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
  <article
    class="container mx-auto max-w-3xl px-4 py-12 leading-relaxed
      [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6
      [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3
      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
      [&_p]:mb-4
      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
      [&_li]:mb-1
      [&_a]:text-primary [&_a]:underline
      [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
      [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4
      [&_pre_code]:bg-transparent [&_pre_code]:p-0
      [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse
      [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold [&_th]:border-b [&_th]:border-border
      [&_td]:p-2 [&_td]:border-b [&_td]:border-border [&_td]:align-top"
  >
    <MDC :value="content" />
  </article>
</template>
