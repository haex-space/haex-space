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
  <article class="container mx-auto max-w-3xl px-4 py-12 legal-prose">
    <MDC :value="content" />
  </article>
</template>

<style scoped>
.legal-prose :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}
.legal-prose :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.legal-prose :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.7;
}
.legal-prose :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.legal-prose :deep(li) {
  margin-bottom: 0.25rem;
  line-height: 1.7;
}
.legal-prose :deep(a) {
  color: var(--primary);
  text-decoration: underline;
}
.legal-prose :deep(code) {
  background: var(--muted);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
.legal-prose :deep(pre) {
  background: var(--muted);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}
</style>