<script setup lang="ts">
import { LayoutDashboard, Package, Settings, LogOut, Menu, X, User } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const store = useMarketplaceStore()

const mobileMenuOpen = ref(false)

// Navigation items
const navigation = computed(() => [
  {
    name: t('developer.nav.dashboard'),
    href: '/developer',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: t('developer.nav.extensions'),
    href: '/developer/extensions',
    icon: Package
  },
  {
    name: t('developer.nav.settings'),
    href: '/developer/settings',
    icon: Settings
  }
])

function isActive(href: string, exact = false) {
  const path = localePath(href)
  if (exact) {
    return route.path === path
  }
  return route.path.startsWith(path)
}

async function handleLogout() {
  await store.signOut()
  await navigateTo(localePath('/developer/auth/login'))
}

// Initialize store
onMounted(() => {
  store.init()
})

// Redirect to login if not authenticated (after loading)
watch([() => store.loading, () => store.isAuthenticated], ([loading, isAuth]) => {
  if (!loading && !isAuth) {
    navigateTo(localePath('/developer/auth/login'))
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Top Navigation -->
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div class="container flex h-16 items-center justify-between px-4">
        <div class="flex items-center gap-4">
          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted"
          >
            <Menu v-if="!mobileMenuOpen" class="h-5 w-5" />
            <X v-else class="h-5 w-5" />
          </button>

          <!-- Logo -->
          <NuxtLinkLocale to="/" class="flex items-center gap-2">
            <img src="/logo.png" alt="haex.space" class="h-8 w-auto" />
          </NuxtLinkLocale>

          <div class="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
            <span>/</span>
            <span class="font-medium text-foreground">{{ t('developer.title') }}</span>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLinkLocale
            v-for="item in navigation"
            :key="item.href"
            :to="item.href"
            :class="[
              'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
              isActive(item.href, item.exact)
                ? 'bg-muted text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            ]"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.name }}
          </NuxtLinkLocale>
        </nav>

        <!-- User Menu -->
        <div class="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="sm" class="gap-2">
                <User class="h-4 w-4" />
                <span class="hidden sm:inline-block max-w-32 truncate">
                  {{ store.user?.email }}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              <DropdownMenuLabel>
                {{ store.user?.email }}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child>
                <NuxtLinkLocale to="/developer/settings" class="flex items-center gap-2 cursor-pointer">
                  <Settings class="h-4 w-4" />
                  {{ t('developer.nav.settings') }}
                </NuxtLinkLocale>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout" class="text-destructive focus:text-destructive cursor-pointer">
                <LogOut class="h-4 w-4 mr-2" />
                {{ t('developer.nav.logout') }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="lg:hidden border-t">
        <nav class="container px-4 py-4 space-y-1">
          <NuxtLinkLocale
            v-for="item in navigation"
            :key="item.href"
            :to="item.href"
            @click="mobileMenuOpen = false"
            :class="[
              'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
              isActive(item.href, item.exact)
                ? 'bg-muted text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            ]"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.name }}
          </NuxtLinkLocale>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container px-4 py-8">
      <!-- Loading state -->
      <div v-if="store.loading" class="flex items-center justify-center min-h-[50vh]">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <!-- Content -->
      <slot v-else />
    </main>
  </div>
</template>
