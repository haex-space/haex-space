<script setup lang="ts">
import impressum from '~/assets/legal/impressum.md?raw'

const { t, locale } = useI18n()

useSeoMeta({
  title: () => `${t('common.imprint')} – haex.space`,
})
</script>

<template>
  <article class="container mx-auto max-w-3xl px-4 py-12 legal-prose" lang="de">
    <p
      v-if="locale !== 'de'"
      class="mb-8 rounded border border-border bg-muted/30 p-4 text-sm text-muted-foreground"
      lang="en"
    >
      The following imprint is required by German law (§ 5 DDG / § 18 MStV) and
      therefore provided in German.
    </p>
    <MDC :value="impressum" />
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
</style>
