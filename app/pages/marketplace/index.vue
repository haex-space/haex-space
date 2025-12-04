<script setup lang="ts">
import { Puzzle, Download, Star, Code } from 'lucide-vue-next'

const { t } = useI18n()

useSeoMeta({
  title: 'Extension Marketplace - haex.space',
  description: 'Discover and install extensions to enhance your haex.space experience.',
})

// Placeholder data - will be fetched from API later
const featuredExtensions = ref([
  {
    slug: 'markdown-editor',
    name: 'Markdown Editor',
    shortDescription: 'A powerful markdown editor with live preview and syntax highlighting.',
    publisher: 'haex',
    downloads: 1250,
    rating: 4.8,
  },
  {
    slug: 'task-manager',
    name: 'Task Manager',
    shortDescription: 'Organize your tasks with projects, tags, and due dates.',
    publisher: 'community',
    downloads: 890,
    rating: 4.6,
  },
  {
    slug: 'code-snippets',
    name: 'Code Snippets',
    shortDescription: 'Save and organize your code snippets with syntax highlighting.',
    publisher: 'haex',
    downloads: 2100,
    rating: 4.9,
  },
])

const categories = ref([
  { slug: 'productivity', name: 'Productivity', icon: 'LucideZap', count: 12 },
  { slug: 'developer-tools', name: 'Developer Tools', icon: 'LucideCode', count: 8 },
  { slug: 'writing', name: 'Writing', icon: 'LucidePenTool', count: 5 },
  { slug: 'utilities', name: 'Utilities', icon: 'LucideWrench', count: 15 },
])
</script>

<template>
  <div>
    <!-- Hero -->
      <section class="container mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">
          {{ t('marketplace.title') }}
        </h1>
        <p class="text-muted-foreground text-lg max-w-2xl">
          {{ t('marketplace.subtitle') }}
        </p>
      </section>

      <!-- Categories -->
      <section class="container mx-auto px-4 pb-12">
        <h2 class="text-xl font-semibold mb-6">{{ t('marketplace.categories') }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLinkLocale
            v-for="category in categories"
            :key="category.slug"
            :to="{ path: '/marketplace', query: { category: category.slug } }"
            class="group"
          >
            <Card class="transition-colors hover:border-primary/50">
              <CardHeader class="pb-3">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-base">{{ category.name }}</CardTitle>
                  <Badge variant="secondary">{{ category.count }}</Badge>
                </div>
              </CardHeader>
            </Card>
          </NuxtLinkLocale>
        </div>
      </section>

      <Separator class="container mx-auto" />

      <!-- Featured Extensions -->
      <section class="container mx-auto px-4 py-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">{{ t('marketplace.featured') }}</h2>
          <NuxtLinkLocale to="/marketplace" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {{ t('common.viewAll') }}
          </NuxtLinkLocale>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLinkLocale
            v-for="ext in featuredExtensions"
            :key="ext.slug"
            :to="`/marketplace/${ext.slug}`"
            class="group"
          >
            <Card class="h-full transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                  <Puzzle class="w-6 h-6 text-primary" />
                </div>
                <CardTitle class="group-hover:text-primary transition-colors">
                  {{ ext.name }}
                </CardTitle>
                <CardDescription>
                  {{ ext.shortDescription }}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div class="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{{ t('marketplace.by') }} {{ ext.publisher }}</span>
                  <div class="flex items-center gap-3">
                    <span class="flex items-center gap-1">
                      <Download class="w-4 h-4" />
                      {{ ext.downloads }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {{ ext.rating }}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </NuxtLinkLocale>
        </div>
      </section>

      <!-- Publish CTA -->
      <section class="bg-muted/50 py-16">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-2xl font-bold mb-4">
            {{ t('marketplace.publishCta.title') }}
          </h2>
          <p class="text-muted-foreground max-w-xl mx-auto mb-8">
            {{ t('marketplace.publishCta.description') }}
          </p>
          <Button as-child size="lg" variant="secondary" class="gap-2">
            <NuxtLinkLocale to="/developer">
              <Code class="w-5 h-5" />
              {{ t('marketplace.publishCta.button') }}
            </NuxtLinkLocale>
          </Button>
        </div>
      </section>
  </div>
</template>
