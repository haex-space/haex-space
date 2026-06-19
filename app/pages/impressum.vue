<script setup lang="ts">
import impressum from '~/assets/legal/impressum.md?raw'

const { t, locale } = useI18n()

useSeoMeta({
  title: () => `${t('common.imprint')} – haex.space`,
})
</script>

<template>
  <LegalArticle lang="de">
    <p
      v-if="locale !== 'de'"
      class="mb-8 rounded border border-border bg-muted/30 p-4 text-sm text-muted-foreground"
      lang="en"
    >
      The following imprint is required by German law (§ 5 DDG / § 18 MStV) and
      therefore provided in German.
    </p>
    <MDC :value="impressum" />
  </LegalArticle>
</template>
