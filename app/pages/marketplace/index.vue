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
  <div class="flex flex-col min-h-screen">
    <!-- Navigation -->
    <header class="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="text-xl font-bold">
            haex.space
          </NuxtLink>
          <NuxtLink to="/marketplace" class="text-foreground font-medium">
            {{ t('common.marketplace') }}
          </NuxtLink>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/auth/login">
            <ShadcnButton variant="outline">{{ t('common.login') }}</ShadcnButton>
          </NuxtLink>
          <NuxtLink to="/auth/register">
            <ShadcnButton>{{ t('common.register') }}</ShadcnButton>
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="flex-1">
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
          <NuxtLink
            v-for="category in categories"
            :key="category.slug"
            :to="`/marketplace/category/${category.slug}`"
            class="group"
          >
            <ShadcnCard class="transition-colors hover:border-primary/50">
              <ShadcnCardHeader class="pb-3">
                <div class="flex items-center justify-between">
                  <ShadcnCardTitle class="text-base">{{ category.name }}</ShadcnCardTitle>
                  <ShadcnBadge variant="secondary">{{ category.count }}</ShadcnBadge>
                </div>
              </ShadcnCardHeader>
            </ShadcnCard>
          </NuxtLink>
        </div>
      </section>

      <ShadcnSeparator class="container mx-auto" />

      <!-- Featured Extensions -->
      <section class="container mx-auto px-4 py-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">{{ t('marketplace.featured') }}</h2>
          <NuxtLink to="/marketplace/all" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {{ t('common.viewAll') }}
          </NuxtLink>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="ext in featuredExtensions"
            :key="ext.slug"
            :to="`/marketplace/extension/${ext.slug}`"
            class="group"
          >
            <ShadcnCard class="h-full transition-all hover:border-primary/50 hover:shadow-lg">
              <ShadcnCardHeader>
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                  <Puzzle class="w-6 h-6 text-primary" />
                </div>
                <ShadcnCardTitle class="group-hover:text-primary transition-colors">
                  {{ ext.name }}
                </ShadcnCardTitle>
                <ShadcnCardDescription>
                  {{ ext.shortDescription }}
                </ShadcnCardDescription>
              </ShadcnCardHeader>
              <ShadcnCardContent>
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
              </ShadcnCardContent>
            </ShadcnCard>
          </NuxtLink>
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
          <ShadcnButton size="lg" variant="secondary" class="gap-2">
            <Code class="w-5 h-5" />
            {{ t('marketplace.publishCta.button') }}
          </ShadcnButton>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-border">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-muted-foreground">
            &copy; {{ new Date().getFullYear() }} haex.space. {{ t('common.allRightsReserved') }}
          </p>
          <div class="flex gap-6 text-sm text-muted-foreground">
            <NuxtLink to="/privacy" class="hover:text-foreground transition-colors">
              {{ t('common.privacy') }}
            </NuxtLink>
            <NuxtLink to="/terms" class="hover:text-foreground transition-colors">
              {{ t('common.terms') }}
            </NuxtLink>
            <a href="https://github.com/haex-space" target="_blank" class="hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
