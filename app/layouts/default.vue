<script setup lang="ts">
import { Languages, Moon, Sun, Monitor, Check } from 'lucide-vue-next'

const { t, locale, locales, setLocale } = useI18n()
const colorMode = useColorMode()

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).map(l => ({
    code: l.code,
    name: l.name
  }))
)

function setTheme(theme: 'light' | 'dark' | 'system') {
  colorMode.preference = theme
}

const themeIcon = computed(() => {
  if (colorMode.preference === 'dark') return Moon
  if (colorMode.preference === 'light') return Sun
  return Monitor
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navigation -->
    <header class="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50">
      <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img src="/logo.png" alt="haex.space" class="h-8 w-auto" />
          </NuxtLink>
          <div class="hidden md:flex items-center gap-6">
            <NuxtLink
              to="/download"
              class="text-muted-foreground hover:text-foreground transition-colors"
              active-class="!text-foreground font-medium"
            >
              {{ t('common.download') }}
            </NuxtLink>
            <NuxtLink
              to="/marketplace"
              class="text-muted-foreground hover:text-foreground transition-colors"
              active-class="!text-foreground font-medium"
            >
              {{ t('common.marketplace') }}
            </NuxtLink>
            <NuxtLink
              to="/docs/extensions"
              class="text-muted-foreground hover:text-foreground transition-colors"
              active-class="!text-foreground font-medium"
            >
              {{ t('common.docs') }}
            </NuxtLink>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Language Switcher -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon">
                <Languages class="h-4 w-4" />
                <span class="sr-only">{{ t('common.language') }}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{{ t('common.language') }}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                v-for="loc in availableLocales"
                :key="loc.code"
                @click="setLocale(loc.code as 'en' | 'de')"
                class="flex items-center justify-between"
              >
                {{ loc.name }}
                <Check v-if="locale === loc.code" class="h-4 w-4 ml-2" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Theme Switcher -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon">
                <component :is="themeIcon" class="h-4 w-4" />
                <span class="sr-only">{{ t('common.theme') }}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{{ t('common.theme') }}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="setTheme('light')" class="flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <Sun class="h-4 w-4" />
                  {{ t('common.themeLight') }}
                </span>
                <Check v-if="colorMode.preference === 'light'" class="h-4 w-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem @click="setTheme('dark')" class="flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <Moon class="h-4 w-4" />
                  {{ t('common.themeDark') }}
                </span>
                <Check v-if="colorMode.preference === 'dark'" class="h-4 w-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem @click="setTheme('system')" class="flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <Monitor class="h-4 w-4" />
                  {{ t('common.themeSystem') }}
                </span>
                <Check v-if="colorMode.preference === 'system'" class="h-4 w-4 ml-2" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NuxtLink to="/auth/login">
            <Button variant="outline">{{ t('common.login') }}</Button>
          </NuxtLink>
          <NuxtLink to="/auth/register">
            <Button>{{ t('common.register') }}</Button>
          </NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Content -->
    <main class="flex-1">
      <slot />
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
