<script setup lang="ts">
import { BookOpen, Puzzle, Rocket, Settings, Shield, Database, Code, ExternalLink, ChevronRight, Menu, X, ChevronDown, Plug, Layers, RefreshCw, Table, TestTube2 } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

// Mobile sidebar state
const leftSidebarOpen = ref(false)
const rightSidebarOpen = ref(false)

// Track active section for highlighting in TOC
const activeSection = ref('')
// Flag to prevent double-scrolling when we set the hash ourselves
const isScrolling = ref(false)

// Reference to main content for scroll reset
const mainContent = ref<HTMLElement | null>(null)

// Close sidebars and reset scroll when route changes
watch(() => route.path, () => {
  leftSidebarOpen.value = false
  rightSidebarOpen.value = false
  activeSection.value = ''
  // Reset scroll position to top
  if (mainContent.value) {
    mainContent.value.scrollTop = 0
  }
})

// Scroll to hash on initial load and hash changes
onMounted(() => {
  if (route.hash) {
    nextTick(() => {
      scrollToHash(route.hash)
    })
  }
})

watch(() => route.hash, (newHash) => {
  if (newHash && !isScrolling.value) {
    scrollToHash(newHash)
  }
})

function scrollToHash(hash: string) {
  const id = hash.replace('#', '')
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeSection.value = id
  }
}

// Documentation navigation structure
const docsNavigation = computed(() => [
  {
    title: t('docs.nav.gettingStarted'),
    items: [
      { title: t('docs.nav.introduction'), href: '/docs', icon: BookOpen },
      { title: t('docs.nav.quickstart'), href: '/docs/quickstart', icon: Rocket },
    ]
  },
  {
    title: t('docs.nav.architecture'),
    items: [
      { title: t('docs.nav.archOverview'), href: '/docs/architecture', icon: Layers },
      { title: t('docs.nav.archSync'), href: '/docs/architecture/sync', icon: RefreshCw },
      { title: t('docs.nav.archExtensions'), href: '/docs/architecture/extensions', icon: Puzzle },
      { title: t('docs.nav.archDatabase'), href: '/docs/architecture/database', icon: Table },
    ]
  },
  {
    title: t('docs.nav.extensions'),
    items: [
      { title: t('docs.nav.buildExtension'), href: '/docs/extensions', icon: Puzzle },
      { title: t('docs.nav.manifest'), href: '/docs/extensions/manifest', icon: Code },
      { title: t('docs.nav.permissions'), href: '/docs/extensions/permissions', icon: Shield },
      { title: t('docs.nav.database'), href: '/docs/extensions/database', icon: Database },
      { title: t('docs.nav.publishing'), href: '/docs/extensions/publishing', icon: Rocket },
    ]
  },
  {
    title: t('docs.nav.sdkReference'),
    items: [
      { title: t('docs.nav.sdkOverview'), href: '/docs/sdk', icon: Code },
      { title: t('docs.nav.sdkDatabase'), href: '/docs/sdk/database', icon: Database },
      { title: t('docs.nav.sdkStorage'), href: '/docs/sdk/storage', icon: Settings },
      { title: t('docs.nav.sdkFilesystem'), href: '/docs/sdk/filesystem', icon: Code },
      { title: t('docs.nav.sdkWeb'), href: '/docs/sdk/web', icon: ExternalLink },
      { title: t('docs.nav.sdkExternalBridge'), href: '/docs/sdk/external-bridge', icon: Plug },
    ]
  }
])

// Get current page's table of contents from the page component
const tableOfContents = useState<Array<{ id: string; title: string; level?: number }>>('docs-toc', () => [])

// Check if current nav item is active
function isActive(href: string) {
  return route.path === localePath(href)
}

// Smooth scroll to section and update URL hash
function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeSection.value = id
    // Update URL hash without triggering scroll (we already scrolled)
    isScrolling.value = true
    router.replace({ hash: `#${id}` })
    nextTick(() => {
      isScrolling.value = false
    })
    rightSidebarOpen.value = false
  }
}
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Navigation Header -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 shrink-0">
      <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Mobile menu buttons -->
          <button
            @click="leftSidebarOpen = !leftSidebarOpen"
            class="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted"
          >
            <Menu class="w-5 h-5" />
          </button>

          <NuxtLinkLocale to="/" class="flex items-center gap-2">
            <img src="/logo.png" alt="haex.space" class="h-8 w-auto" />
          </NuxtLinkLocale>

          <div class="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronRight class="w-4 h-4" />
            <span class="font-medium text-foreground">{{ t('docs.title') }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {{ t('common.download') }}
                <ChevronDown class="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem as-child>
                  <NuxtLinkLocale to="/download" class="flex flex-col items-start cursor-pointer">
                    <span class="font-medium">{{ t('common.downloadVault') }}</span>
                    <span class="text-xs text-muted-foreground">{{ t('common.downloadVaultDesc') }}</span>
                  </NuxtLinkLocale>
                </DropdownMenuItem>
                <DropdownMenuItem as-child>
                  <NuxtLinkLocale to="/download/haex-pass" class="flex flex-col items-start cursor-pointer">
                    <span class="font-medium">{{ t('common.downloadPass') }}</span>
                    <span class="text-xs text-muted-foreground">{{ t('common.downloadPassDesc') }}</span>
                  </NuxtLinkLocale>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <NuxtLinkLocale
              to="/marketplace"
              class="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {{ t('common.marketplace') }}
            </NuxtLinkLocale>
          </div>

          <a
            href="https://github.com/haex-space/vault-sdk"
            target="_blank"
            class="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
            <ExternalLink class="w-3.5 h-3.5" />
          </a>

          <!-- Mobile TOC button -->
          <ClientOnly>
            <button
              v-if="tableOfContents.length > 0"
              @click="rightSidebarOpen = !rightSidebarOpen"
              class="lg:hidden p-2 -mr-2 rounded-md hover:bg-muted"
            >
              <span class="text-sm font-medium">{{ t('docs.onThisPage') }}</span>
            </button>
          </ClientOnly>
        </div>
      </nav>
    </header>

    <!-- Main layout with fixed sidebars -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar - Page Navigation (fixed) -->
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-40 w-72 bg-background border-r border-border transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 lg:shrink-0',
          leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <!-- Mobile overlay -->
        <div
          v-if="leftSidebarOpen"
          class="fixed inset-0 bg-background/80 backdrop-blur-sm z-[-1] lg:hidden"
          @click="leftSidebarOpen = false"
        />

        <div class="h-full overflow-y-auto py-6 px-4">
          <!-- Mobile close button -->
          <div class="flex items-center justify-between mb-6 lg:hidden">
            <span class="font-semibold">{{ t('docs.navigation') }}</span>
            <button @click="leftSidebarOpen = false" class="p-1 rounded-md hover:bg-muted">
              <X class="w-5 h-5" />
            </button>
          </div>

          <nav class="space-y-8">
            <div v-for="section in docsNavigation" :key="section.title">
              <h3 class="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3 px-3">
                {{ section.title }}
              </h3>
              <ul class="space-y-1">
                <li v-for="item in section.items" :key="item.href">
                  <NuxtLinkLocale
                    :to="item.href"
                    :class="[
                      'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    ]"
                  >
                    <component :is="item.icon" class="w-4 h-4 shrink-0" />
                    {{ item.title }}
                  </NuxtLinkLocale>
                </li>
              </ul>
            </div>
          </nav>

          <!-- External Links -->
          <div class="mt-8 pt-8 border-t border-border">
            <h3 class="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3 px-3">
              {{ t('docs.nav.resources') }}
            </h3>
            <ul class="space-y-1">
              <li>
                <a
                  href="https://github.com/haex-space/vault-sdk"
                  target="_blank"
                  class="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Code class="w-4 h-4" />
                  SDK Repository
                  <ExternalLink class="w-3 h-3 ml-auto" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/haex-space/haex-vault"
                  target="_blank"
                  class="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Database class="w-4 h-4" />
                  haex-vault Repository
                  <ExternalLink class="w-3 h-3 ml-auto" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/haex-space/haex-vault/actions/workflows/e2e.yml"
                  target="_blank"
                  class="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <TestTube2 class="w-4 h-4" />
                  {{ t('docs.nav.e2eArtifacts') }}
                  <ExternalLink class="w-3 h-3 ml-auto" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <!-- Main Content (scrollable) -->
      <main ref="mainContent" class="flex-1 min-w-0 overflow-y-auto">
        <div class="max-w-4xl mx-auto px-6 py-12">
          <slot />
        </div>
      </main>

      <!-- Right Sidebar - Table of Contents (fixed) -->
      <aside
        v-if="tableOfContents.length > 0"
        :class="[
          'fixed inset-y-0 right-0 z-40 w-64 bg-background border-l border-border transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 lg:shrink-0',
          rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        ]"
      >
        <!-- Mobile overlay -->
        <div
          v-if="rightSidebarOpen"
          class="fixed inset-0 bg-background/80 backdrop-blur-sm z-[-1] lg:hidden"
          @click="rightSidebarOpen = false"
        />

        <div class="h-full overflow-y-auto py-6 px-4">
          <!-- Mobile close button -->
          <div class="flex items-center justify-between mb-6 lg:hidden">
            <span class="font-semibold">{{ t('docs.onThisPage') }}</span>
            <button @click="rightSidebarOpen = false" class="p-1 rounded-md hover:bg-muted">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 class="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4 hidden lg:block">
              {{ t('docs.onThisPage') }}
            </h3>
            <nav class="space-y-1">
              <button
                v-for="item in tableOfContents"
                :key="item.id"
                @click="scrollToSection(item.id)"
                :class="[
                  'block w-full text-left py-1.5 text-sm rounded transition-colors hover:text-foreground',
                  item.level === 2 ? 'pl-0' : 'pl-4',
                  activeSection === item.id || route.hash === `#${item.id}`
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                ]"
              >
                {{ item.title }}
              </button>
            </nav>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
